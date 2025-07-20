import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import UserModel from '../models/UserModel';
import { verifyRecaptcha } from '../middlewares/recaptchaMiddleware';
import { testRecaptcha } from '../controllers/testController';

export const createAuthRouter = (userModel: UserModel): Router => {
  const authRouter = Router();
  const authController = new AuthController(userModel);

  // Endpoint de prueba para reCAPTCHA
  authRouter.post('/test-recaptcha', testRecaptcha);

  // Registrar un nuevo usuario (con verificación de reCAPTCHA)
  authRouter.post('/register', verifyRecaptcha, authController.register);

  // Iniciar sesión (con verificación de reCAPTCHA)
  authRouter.post('/login', verifyRecaptcha, authController.login);

  // Refrescar el access token
  authRouter.post('/refresh-token', authController.refreshToken);

  // Cerrar sesión
  authRouter.post('/logout', authController.logout);
  return authRouter;
};
