// Verificar configuración de reCAPTCHA
console.log('=== Configuración reCAPTCHA ===');
console.log('VITE_RECAPTCHA_SITE_KEY:', import.meta.env.VITE_RECAPTCHA_SITE_KEY ? 'Configurado' : 'NO CONFIGURADO');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

// Exportar para uso en componentes
export const checkRecaptchaConfig = () => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  return {
    recaptchaConfigured: !!siteKey,
    apiConfigured: !!apiUrl,
    siteKey,
    apiUrl
  };
};
