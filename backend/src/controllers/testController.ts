import { Request, Response } from 'express';

// Debug endpoint para verificar códigos de respaldo
export const debugBackupCodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email requerido' });
      return;
    }

    const UserModel = require('../models/UserModel').default;
    const userModel = new UserModel();

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const twoFactorInfo = await userModel.get2FAInfo(user.user_id);

    res.json({
      user_id: user.user_id,
      email: user.email,
      two_factor_enabled: twoFactorInfo?.two_factor_enabled,
      backup_codes: twoFactorInfo?.backup_codes,
      backup_codes_count: twoFactorInfo?.backup_codes?.length || 0,
    });
  } catch (error: any) {
    console.error('Error en debug backup codes:', error);
    res.status(500).json({ error: error.message });
  }
};

export const testRecaptcha = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🧪 Test reCAPTCHA endpoint llamado');
    console.log('📝 Variables de entorno:');
    console.log('- RECAPTCHA_SECRET_KEY:', process.env.RECAPTCHA_SECRET_KEY ? 'Configurada' : 'NO CONFIGURADA');

    const { recaptchaToken } = req.body;
    console.log('🔑 Token recibido:', recaptchaToken ? `${recaptchaToken.substring(0, 20)}...` : 'NINGUNO');

    if (!recaptchaToken) {
      res.status(400).json({
        error: 'Token de reCAPTCHA requerido para la prueba',
        hasSecretKey: !!process.env.RECAPTCHA_SECRET_KEY,
      });
      return;
    }

    // Hacer la verificación directamente
    const axios = require('axios');
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      },
    });

    console.log('🌐 Respuesta completa de Google:', response.data);

    res.json({
      success: true,
      googleResponse: response.data,
      hasSecretKey: !!process.env.RECAPTCHA_SECRET_KEY,
      tokenLength: recaptchaToken.length,
    });
  } catch (error: any) {
    console.error('❌ Error en test reCAPTCHA:', error.message);
    res.status(500).json({
      error: 'Error interno',
      message: error.message,
    });
  }
};
