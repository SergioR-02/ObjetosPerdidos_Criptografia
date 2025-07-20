import { Router } from 'express';
import { TwoFactorController } from '../controllers/twoFactorController';
import UserModel from '../models/UserModel';
import { authenticate } from '../middlewares/authMiddleware';

export const createTwoFactorRouter = (userModel: UserModel): Router => {
  const twoFactorRouter = Router();
  const twoFactorController = new TwoFactorController(userModel);

  // Todas las rutas de 2FA requieren autenticación
  twoFactorRouter.use(authenticate);

  // Configurar 2FA - Generar QR code
  twoFactorRouter.post('/setup', twoFactorController.setupTwoFactor);

  // Habilitar 2FA - Verificar código y activar
  twoFactorRouter.post('/enable', twoFactorController.enableTwoFactor);

  // Verificar código 2FA (usado internamente)
  twoFactorRouter.post('/verify', twoFactorController.verifyTwoFactor);

  // Deshabilitar 2FA
  twoFactorRouter.post('/disable', twoFactorController.disableTwoFactor);

  // Obtener estado actual de 2FA
  twoFactorRouter.get('/status', twoFactorController.getTwoFactorStatus);

  // Regenerar códigos de respaldo
  twoFactorRouter.post('/regenerate-backup-codes', twoFactorController.regenerateBackupCodes);

  return twoFactorRouter;
}; 