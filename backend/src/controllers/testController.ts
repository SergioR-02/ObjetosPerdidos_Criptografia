import { Request, Response } from 'express';

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
        hasSecretKey: !!process.env.RECAPTCHA_SECRET_KEY
      });
      return;
    }

    // Hacer la verificación directamente
    const axios = require('axios');
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken
      }
    });

    console.log('🌐 Respuesta completa de Google:', response.data);

    res.json({
      success: true,
      googleResponse: response.data,
      hasSecretKey: !!process.env.RECAPTCHA_SECRET_KEY,
      tokenLength: recaptchaToken.length
    });
  } catch (error: any) {
    console.error('❌ Error en test reCAPTCHA:', error.message);
    res.status(500).json({ 
      error: 'Error interno',
      message: error.message 
    });
  }
};
