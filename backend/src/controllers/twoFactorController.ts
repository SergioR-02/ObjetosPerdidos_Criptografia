import { Request, Response } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import UserModel from '../models/UserModel';
import { validateVerify2FA, validateEnable2FA, validateDisable2FA } from '../schemas/authSchemas';
import crypto from 'crypto';

export class TwoFactorController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  // Generar un secreto para 2FA y devolver QR code
  setupTwoFactor = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user.user_id;

      // Verificar si el usuario ya tiene 2FA habilitado
      const twoFactorInfo = await this.userModel.get2FAInfo(userId);
      if (twoFactorInfo?.two_factor_enabled) {
        res.status(400).json({
          message: '2FA ya está habilitado para este usuario',
          error: 'TWO_FACTOR_ALREADY_ENABLED',
        });
        return;
      }

      // Obtener información del usuario
      const user = await this.userModel.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      // Generar secreto para 2FA
      const secret = speakeasy.generateSecret({
        name: `${user.name} (${user.email})`,
        issuer: 'Objetos Perdidos UN',
        length: 20,
      });

      // Guardar el secreto temporalmente (no habilitar 2FA aún)
      await this.userModel.set2FASecret(userId, secret.base32);

      // Generar código QR
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      res.status(200).json({
        message: 'Secreto 2FA generado',
        qrCode: qrCodeUrl,
        manualEntryKey: secret.base32,
        instructions:
          'Escanea el código QR con tu aplicación de autenticación y luego verifica tu código para habilitar 2FA',
      });
    } catch (error) {
      console.error('Error en setup 2FA:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  // Verificar código y habilitar 2FA
  enableTwoFactor = async (req: Request, res: Response): Promise<void> => {
    const validate = validateEnable2FA(req.body);

    if (!validate.success) {
      res.status(400).json({ error: JSON.parse(validate.error.message) });
      return;
    }

    try {
      const userId = req.body.user.user_id;
      const { code } = validate.data;

      // Obtener el secreto temporal
      const twoFactorInfo = await this.userModel.get2FAInfo(userId);
      if (!twoFactorInfo?.two_factor_secret) {
        res.status(400).json({ message: 'No se ha configurado un secreto 2FA. Ejecuta primero /setup-2fa' });
        return;
      }

      if (twoFactorInfo.two_factor_enabled) {
        res.status(400).json({ message: '2FA ya está habilitado' });
        return;
      }

      // Verificar el código
      const verified = speakeasy.totp.verify({
        secret: twoFactorInfo.two_factor_secret,
        encoding: 'base32',
        token: code,
        window: 2,
      });

      if (!verified) {
        res.status(400).json({ message: 'Código de verificación inválido' });
        return;
      }

      // Generar códigos de respaldo
      const backupCodes = this.generateBackupCodes();

      // Habilitar 2FA y guardar códigos de respaldo
      await this.userModel.enable2FA(userId, backupCodes);

      res.status(200).json({
        message: '2FA habilitado exitosamente',
        backupCodes: backupCodes,
        warning: 'Guarda estos códigos de respaldo en un lugar seguro. No podrás verlos de nuevo.',
      });
    } catch (error) {
      console.error('Error habilitando 2FA:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  // Verificar código 2FA (para usar durante login)
  verifyTwoFactor = async (req: Request, res: Response): Promise<void> => {
    const validate = validateVerify2FA(req.body);

    if (!validate.success) {
      res.status(400).json({ error: JSON.parse(validate.error.message) });
      return;
    }

    try {
      const userId = req.body.user.user_id;
      const { code } = validate.data;

      // Obtener información de 2FA
      const twoFactorInfo = await this.userModel.get2FAInfo(userId);
      if (!twoFactorInfo?.two_factor_enabled || !twoFactorInfo.two_factor_secret) {
        res.status(400).json({ message: '2FA no está habilitado para este usuario' });
        return;
      }

      // Primero intentar verificar con TOTP
      const verified = speakeasy.totp.verify({
        secret: twoFactorInfo.two_factor_secret,
        encoding: 'base32',
        token: code,
        window: 2,
      });

      if (verified) {
        res.status(200).json({ message: 'Código verificado correctamente' });
        return;
      }

      // Si TOTP falla, verificar si es un código de respaldo
      if (twoFactorInfo.backup_codes && twoFactorInfo.backup_codes.includes(code)) {
        // Usar el código de respaldo (lo elimina de la lista)
        const used = await this.userModel.useBackupCode(userId, code);
        if (used) {
          res.status(200).json({
            message: 'Código de respaldo verificado correctamente',
            warning: 'Has usado un código de respaldo. Considera regenerar nuevos códigos.',
          });
          return;
        }
      }

      res.status(400).json({ message: 'Código de verificación inválido' });
    } catch (error) {
      console.error('Error verificando 2FA:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  // Deshabilitar 2FA
  disableTwoFactor = async (req: Request, res: Response): Promise<void> => {
    const validate = validateDisable2FA(req.body);

    if (!validate.success) {
      res.status(400).json({ error: JSON.parse(validate.error.message) });
      return;
    }

    try {
      const userId = req.body.user.user_id;
      const { code } = validate.data;

      // Verificar que 2FA esté habilitado
      const twoFactorInfo = await this.userModel.get2FAInfo(userId);
      if (!twoFactorInfo?.two_factor_enabled) {
        res.status(400).json({ message: '2FA no está habilitado' });
        return;
      }

      // Verificar el código
      const verified = speakeasy.totp.verify({
        secret: twoFactorInfo.two_factor_secret!,
        encoding: 'base32',
        token: code,
        window: 2,
      });

      if (!verified) {
        // También permitir deshabilitar con código de respaldo
        if (!twoFactorInfo.backup_codes || !twoFactorInfo.backup_codes.includes(code)) {
          res.status(400).json({ message: 'Código de verificación inválido' });
          return;
        }
      }

      // Deshabilitar 2FA
      await this.userModel.disable2FA(userId);

      res.status(200).json({ message: '2FA deshabilitado exitosamente' });
    } catch (error) {
      console.error('Error deshabilitando 2FA:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  // Obtener estado actual de 2FA
  getTwoFactorStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user.user_id;

      if (!userId) {
        res.status(400).json({ message: 'ID de usuario requerido' });
        return;
      }

      const twoFactorInfo = await this.userModel.get2FAInfo(userId);

      // Manejar caso donde el usuario no existe
      if (twoFactorInfo === null) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      res.status(200).json({
        enabled: !!twoFactorInfo.two_factor_enabled,
        hasBackupCodes: !!(twoFactorInfo.backup_codes && twoFactorInfo.backup_codes.length > 0),
        backupCodesCount: twoFactorInfo.backup_codes?.length || 0,
      });
    } catch (error: any) {
      console.error('Error obteniendo estado 2FA:', error);
      res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  // Regenerar códigos de respaldo
  regenerateBackupCodes = async (req: Request, res: Response): Promise<void> => {
    const validate = validateVerify2FA(req.body);

    if (!validate.success) {
      res.status(400).json({ error: JSON.parse(validate.error.message) });
      return;
    }

    try {
      const userId = req.body.user.user_id;
      const { code } = validate.data;

      // Verificar que 2FA esté habilitado
      const twoFactorInfo = await this.userModel.get2FAInfo(userId);
      if (!twoFactorInfo?.two_factor_enabled) {
        res.status(400).json({ message: '2FA no está habilitado' });
        return;
      }

      // Verificar el código
      const verified = speakeasy.totp.verify({
        secret: twoFactorInfo.two_factor_secret!,
        encoding: 'base32',
        token: code,
        window: 2,
      });

      if (!verified) {
        res.status(400).json({ message: 'Código de verificación inválido' });
        return;
      }

      // Generar nuevos códigos de respaldo
      const newBackupCodes = this.generateBackupCodes();

      // Actualizar en la base de datos
      await this.userModel.enable2FA(userId, newBackupCodes);

      res.status(200).json({
        message: 'Códigos de respaldo regenerados exitosamente',
        backupCodes: newBackupCodes,
        warning: 'Los códigos anteriores ya no son válidos. Guarda estos nuevos códigos en un lugar seguro.',
      });
    } catch (error) {
      console.error('Error regenerando códigos de respaldo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  // Método privado para generar códigos de respaldo
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generar código de 8 caracteres aleatorios
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }
}
