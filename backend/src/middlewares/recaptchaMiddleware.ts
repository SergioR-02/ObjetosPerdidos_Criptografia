import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

export const verifyRecaptcha = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    res.status(400).json({ 
      success: false, 
      message: 'Token de reCAPTCHA requerido' 
    });
    return;
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY no encontrada en variables de entorno');
      res.status(500).json({ 
        success: false, 
        message: 'Error de configuración del servidor' 
      });
      return;
    }

    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    
    const response = await axios.post(verificationUrl, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken,
        remoteip: req.ip || req.connection.remoteAddress
      }
    });

    const { success, 'error-codes': errorCodes } = response.data;

    if (!success) {
      res.status(400).json({ 
        success: false, 
        message: 'Verificación de reCAPTCHA fallida',
        errorCodes: errorCodes
      });
      return;
    }

    next();
  } catch (error: any) {
    console.error('Error verificando reCAPTCHA:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
    return;
  }
};
