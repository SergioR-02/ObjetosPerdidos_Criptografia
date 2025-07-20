import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MainButton from '../../atoms/mainButton/MainButton';
import InputField from '../../atoms/inputField/InputField';
import ErrorMessage from '../../atoms/errorMessage/ErrorMessage';
import API_BASE_URL from '../../config/api';
import './TwoFactorVerification.scss';

const TwoFactorVerification = ({
  email,
  password,
  recaptchaToken,
  onSuccess,
  onCancel,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBackupCode, setIsBackupCode] = useState(false);

  // Resetear el código cuando se monta el componente
  useEffect(() => {
    setVerificationCode('');
    setError('');
  }, []);

  const handleVerification = async () => {
    if (!verificationCode) {
      setError('Ingresa el código de verificación');
      return;
    }

    // Validar longitud según el tipo de código
    if (!isBackupCode && verificationCode.length !== 6) {
      setError('El código de autenticación debe tener 6 dígitos');
      return;
    }

    if (isBackupCode && verificationCode.length !== 8) {
      setError('El código de respaldo debe tener 8 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Llamar al endpoint de login con 2FA
      const response = await fetch(`${API_BASE_URL}/auth/login-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          twoFactorCode: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Autenticación exitosa');
        if (data.warning) {
          toast.warning(data.warning);
        }
        onSuccess();
      } else {
        setError(data.message || 'Error en la verificación');
        toast.error('Código de verificación inválido');
      }
    } catch (error) {
      console.error('Error en verificación 2FA:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    let value = e.target.value;

    if (isBackupCode) {
      // Para códigos de respaldo, mantener solo letras y números, max 8 caracteres
      value = value
        .toUpperCase()
        .replace(/[^A-F0-9]/g, '')
        .slice(0, 8);
    } else {
      // Para códigos TOTP, solo números, max 6 dígitos
      value = value.replace(/\D/g, '').slice(0, 6);
    }

    setVerificationCode(value);
    if (error) setError(''); // Limpiar error cuando se empieza a escribir
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && verificationCode.length > 0) {
      handleVerification();
    }
  };

  return (
    <div className='two-factor-verification'>
      <div className='two-factor-verification__header'>
        <h3>Verificación en Dos Pasos</h3>
        <p>
          {isBackupCode
            ? 'Ingresa uno de tus códigos de respaldo de 8 caracteres'
            : 'Ingresa el código de 6 dígitos de tu aplicación de autenticación'}
        </p>
      </div>

      <div className='two-factor-verification__form'>
        <InputField
          type='text'
          placeholder={isBackupCode ? 'AB12CD34' : '123456'}
          value={verificationCode}
          onChange={handleCodeChange}
          onKeyPress={handleKeyPress}
          maxLength={isBackupCode ? 8 : 6}
          autoFocus
          className='two-factor-verification__input'
        />

        {error && <ErrorMessage message={error} />}

        <div className='two-factor-verification__actions'>
          <MainButton
            onClick={handleVerification}
            disabled={loading || verificationCode.length === 0}
            color='primary'
            fullWidth
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </MainButton>

          <button
            type='button'
            className='two-factor-verification__switch-mode'
            onClick={() => {
              setIsBackupCode(!isBackupCode);
              setVerificationCode('');
              setError('');
            }}
          >
            {isBackupCode
              ? '¿Prefieres usar tu aplicación de autenticación?'
              : '¿No tienes acceso? Usar código de respaldo'}
          </button>

          <MainButton
            onClick={onCancel}
            color='secondary'
            variant='outlined'
            fullWidth
          >
            Cancelar
          </MainButton>
        </div>
      </div>

      <div className='two-factor-verification__help'>
        <details>
          <summary>¿Necesitas ayuda?</summary>
          <div className='two-factor-verification__help-content'>
            <h4>Aplicación de Autenticación:</h4>
            <ul>
              <li>
                Abre tu aplicación de autenticación (Google Authenticator,
                Authy, etc.)
              </li>
              <li>Busca la entrada para "Objetos Perdidos UN"</li>
              <li>Ingresa el código de 6 dígitos que aparece</li>
            </ul>

            <h4>Códigos de Respaldo:</h4>
            <ul>
              <li>
                Usa uno de los códigos de 8 caracteres que guardaste al
                configurar 2FA
              </li>
              <li>Cada código solo puede usarse una vez</li>
              <li>Considera regenerar nuevos códigos después de usar uno</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
