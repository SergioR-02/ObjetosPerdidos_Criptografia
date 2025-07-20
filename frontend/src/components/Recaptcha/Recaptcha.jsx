import React, { forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const RecaptchaComponent = forwardRef((props, ref) => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error('reCAPTCHA site key not found in environment variables');
    return (
      <div style={{ color: 'red', fontSize: '14px' }}>
        Error: reCAPTCHA no configurado
      </div>
    );
  }

  return (
    <ReCAPTCHA
      ref={ref}
      sitekey={siteKey}
      onChange={props.onChange}
      onError={props.onError}
      onExpired={props.onExpired}
      theme={props.theme || 'light'}
      size={props.size || 'normal'}
    />
  );
});

RecaptchaComponent.displayName = 'RecaptchaComponent';

export default RecaptchaComponent;
