import React, { useState } from 'react';
import { toast } from 'sonner';
import MainButton from '../../atoms/mainButton/MainButton';
import InputField from '../../atoms/inputField/InputField';
import ErrorMessage from '../../atoms/errorMessage/ErrorMessage';
import API_BASE_URL from '../../config/api';
import axios from 'axios';
import './TwoFactorSetup.scss';

const TwoFactorSetup = ({ onSetupComplete, onCancel }) => {
  const [step, setStep] = useState(1); // 1: Generate QR, 2: Verify Code
  const [qrCode, setQrCode] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Paso 1: Generar QR code
  const generateQRCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/2fa/setup`,
        {},
        { withCredentials: true },
      );

      setQrCode(response.data.qrCode);
      setManualKey(response.data.manualEntryKey);
      setStep(2);
      toast.success('Código QR generado correctamente');
    } catch (error) {
      console.error('Error generando QR:', error);
      setError(error.response?.data?.message || 'Error al generar código QR');
      toast.error('Error al generar código QR');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código y habilitar 2FA
  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Ingresa un código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/2fa/enable`,
        { code: verificationCode },
        { withCredentials: true },
      );

      setBackupCodes(response.data.backupCodes);
      setStep(3);
      toast.success('2FA habilitado exitosamente');
    } catch (error) {
      console.error('Error habilitando 2FA:', error);
      setError(error.response?.data?.message || 'Error al verificar código');
      toast.error('Código de verificación inválido');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar paso 1: Instrucciones iniciales
  const renderStepOne = () => (
    <div className='two-factor-setup__step'>
      <h3>Configurar Autenticación en Dos Pasos</h3>
      <p>
        La autenticación en dos pasos agrega una capa adicional de seguridad a
        tu cuenta. Necesitarás una aplicación de autenticación como Google
        Authenticator, Authy o Microsoft Authenticator.
      </p>
      <div className='two-factor-setup__instructions'>
        <h4>Instrucciones:</h4>
        <ol>
          <li>Descarga una aplicación de autenticación en tu teléfono</li>
          <li>Haz clic en "Generar Código QR" a continuación</li>
          <li>Escanea el código QR con tu aplicación</li>
          <li>Ingresa el código de 6 dígitos que aparece en tu aplicación</li>
        </ol>
      </div>
      <div className='two-factor-setup__actions'>
        <MainButton onClick={generateQRCode} disabled={loading} color='primary'>
          {loading ? 'Generando...' : 'Generar Código QR'}
        </MainButton>
        <MainButton onClick={onCancel} color='secondary' variant='outlined'>
          Cancelar
        </MainButton>
      </div>
    </div>
  );

  // Renderizar paso 2: Mostrar QR y verificar código
  const renderStepTwo = () => (
    <div className='two-factor-setup__step'>
      <h3>Escanea el Código QR</h3>

      <div className='two-factor-setup__qr-section'>
        <div className='two-factor-setup__qr-container'>
          <img
            src={qrCode}
            alt='Código QR para 2FA'
            className='two-factor-setup__qr-image'
          />
        </div>

        <div className='two-factor-setup__manual-key'>
          <p>
            <strong>¿No puedes escanear el código?</strong>
          </p>
          <p>Ingresa esta clave manualmente en tu aplicación:</p>
          <code className='two-factor-setup__key'>{manualKey}</code>
        </div>
      </div>

      <div className='two-factor-setup__verify'>
        <h4>Verificar Configuración</h4>
        <p>Ingresa el código de 6 dígitos de tu aplicación de autenticación:</p>

        <InputField
          type='text'
          placeholder='123456'
          value={verificationCode}
          onChange={(e) =>
            setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
          }
          maxLength={6}
        />

        {error && <ErrorMessage message={error} />}

        <div className='two-factor-setup__actions'>
          <MainButton
            onClick={verifyAndEnable}
            disabled={loading || verificationCode.length !== 6}
            color='primary'
          >
            {loading ? 'Verificando...' : 'Verificar y Habilitar'}
          </MainButton>
          <MainButton
            onClick={() => setStep(1)}
            color='secondary'
            variant='outlined'
          >
            Volver
          </MainButton>
        </div>
      </div>
    </div>
  );

  // Renderizar paso 3: Mostrar códigos de respaldo
  const renderStepThree = () => (
    <div className='two-factor-setup__step'>
      <h3>¡2FA Configurado Exitosamente!</h3>

      <div className='two-factor-setup__backup-codes'>
        <div className='two-factor-setup__warning'>
          <h4>⚠️ Códigos de Respaldo Importantes</h4>
          <p>
            Guarda estos códigos en un lugar seguro. Cada código solo puede
            usarse una vez. Si pierdes acceso a tu aplicación de autenticación,
            puedes usar estos códigos para ingresar.
          </p>
        </div>

        <div className='two-factor-setup__codes-grid'>
          {backupCodes.map((code, index) => (
            <div key={index} className='two-factor-setup__backup-code'>
              {code}
            </div>
          ))}
        </div>

        <div className='two-factor-setup__backup-actions'>
          <MainButton
            onClick={() => {
              const codesText = backupCodes.join('\n');
              navigator.clipboard.writeText(codesText);
              toast.success('Códigos copiados al portapapeles');
            }}
            color='secondary'
            variant='outlined'
          >
            Copiar Códigos
          </MainButton>

          <MainButton
            onClick={() => {
              const codesText = backupCodes.join('\n');
              const blob = new Blob([codesText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'backup-codes-2fa.txt';
              a.click();
              URL.revokeObjectURL(url);
              toast.success('Códigos descargados');
            }}
            color='secondary'
            variant='outlined'
          >
            Descargar Códigos
          </MainButton>
        </div>
      </div>

      <div className='two-factor-setup__actions'>
        <MainButton
          onClick={() => {
            toast.success('Configuración de 2FA completada');
            onSetupComplete();
          }}
          color='primary'
        >
          Finalizar
        </MainButton>
      </div>
    </div>
  );

  return (
    <div className='two-factor-setup'>
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
      {step === 3 && renderStepThree()}
    </div>
  );
};

export default TwoFactorSetup;
