import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../../organisms/header/Header';
import { Footer } from '../../organisms/footer/Footer';
import BasicLayout from '../layout/BasicLayout';
import MainButton from '../../atoms/mainButton/MainButton';
import InputField from '../../atoms/inputField/InputField';
import ErrorMessage from '../../atoms/errorMessage/ErrorMessage';
import API_BASE_URL from '../../config/api';
import axios from 'axios';
import './TwoFactorSetupPage.scss';

const TwoFactorSetupPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFactorStatus, setTwoFactorStatus] = useState(null);

  // Cargar estado actual de 2FA
  useEffect(() => {
    loadTwoFactorStatus();
  }, []);

  const loadTwoFactorStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/2fa/status`, {
        withCredentials: true,
      });
      setTwoFactorStatus(response.data);

      // Si ya está habilitado, redirigir a perfil
      if (response.data.enabled) {
        toast.info('2FA ya está habilitado para tu cuenta');
        navigate('/profileInformation');
      }
    } catch (error) {
      console.error('Error cargando estado 2FA:', error);

      // Si el error indica que 2FA ya está habilitado, redirigir
      if (error.response?.data?.error === 'TWO_FACTOR_ALREADY_ENABLED') {
        toast.info('2FA ya está configurado en tu cuenta');
        navigate('/profileInformation');
        return;
      }

      // En caso de error, asumir que no está habilitado y permitir continuar
      setTwoFactorStatus({
        enabled: false,
        hasBackupCodes: false,
        backupCodesCount: 0,
      });
    }
  };

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
      setCurrentStep(2);
      toast.success('Código QR generado correctamente');
    } catch (error) {
      console.error('Error generando QR:', error);

      // Si 2FA ya está habilitado, redirigir
      if (error.response?.data?.error === 'TWO_FACTOR_ALREADY_ENABLED') {
        toast.info('2FA ya está configurado en tu cuenta');
        navigate('/profileInformation');
        return;
      }

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
      setCurrentStep(3);
      toast.success('🎉 ¡2FA habilitado exitosamente!');
    } catch (error) {
      console.error('Error habilitando 2FA:', error);
      setError(error.response?.data?.message || 'Error al verificar código');
      toast.error('Código de verificación inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    toast.success('Configuración de 2FA completada exitosamente');
    navigate('/profileInformation');
  };

  const handleCancel = () => {
    navigate('/profileInformation');
  };

  // Renderizar paso 1: Introducción y explicación
  const renderStep1 = () => (
    <div className='two-factor-setup-page__step'>
      <div className='two-factor-setup-page__header'>
        <div className='two-factor-setup-page__icon'>🛡️</div>
        <h1>Configurar Autenticación en Dos Pasos</h1>
        <p>Protege tu cuenta con una capa adicional de seguridad</p>
      </div>

      <div className='two-factor-setup-page__info'>
        <h3>¿Qué es la autenticación en dos pasos?</h3>
        <p>
          La autenticación en dos pasos (2FA) agrega una capa extra de seguridad
          a tu cuenta. Después de ingresar tu contraseña, necesitarás un código
          de 6 dígitos de tu teléfono.
        </p>

        <div className='two-factor-setup-page__benefits'>
          <h4>Beneficios:</h4>
          <ul>
            <li>✅ Mayor seguridad para tu cuenta</li>
            <li>✅ Protección contra accesos no autorizados</li>
            <li>✅ Códigos de respaldo para emergencias</li>
            <li>✅ Compatible con Google Authenticator, Authy y más</li>
          </ul>
        </div>

        <div className='two-factor-setup-page__requirements'>
          <h4>Necesitarás:</h4>
          <ul>
            <li>📱 Un teléfono inteligente</li>
            <li>📲 Una app de autenticación (te ayudamos a elegir)</li>
            <li>⏱️ 2-3 minutos de tu tiempo</li>
          </ul>
        </div>

        <div className='two-factor-setup-page__apps'>
          <h4>Apps recomendadas:</h4>
          <div className='two-factor-setup-page__apps-grid'>
            <div className='app-card'>
              <strong>Google Authenticator</strong>
              <p>Gratis • Android/iOS</p>
            </div>
            <div className='app-card'>
              <strong>Authy</strong>
              <p>Gratis • Sincroniza dispositivos</p>
            </div>
            <div className='app-card'>
              <strong>Microsoft Authenticator</strong>
              <p>Gratis • Android/iOS</p>
            </div>
          </div>
        </div>
      </div>

      <div className='two-factor-setup-page__actions'>
        <MainButton
          onClick={generateQRCode}
          disabled={loading}
          color='primary'
          className='two-factor-setup-page__primary-btn'
        >
          {loading ? 'Generando...' : '🚀 Comenzar Configuración'}
        </MainButton>
        <MainButton onClick={handleCancel} color='secondary' variant='outlined'>
          Ahora no
        </MainButton>
      </div>
    </div>
  );

  // Renderizar paso 2: Escanear QR y verificar
  const renderStep2 = () => (
    <div className='two-factor-setup-page__step'>
      <div className='two-factor-setup-page__header'>
        <div className='two-factor-setup-page__icon'>📱</div>
        <h1>Escanea el Código QR</h1>
        <p>Usa tu app de autenticación para escanear este código</p>
      </div>

      <div className='two-factor-setup-page__qr-section'>
        <div className='two-factor-setup-page__instructions'>
          <h4>Instrucciones:</h4>
          <ol>
            <li>Abre tu app de autenticación</li>
            <li>Busca la opción "Agregar cuenta" o "+"</li>
            <li>Selecciona "Escanear código QR"</li>
            <li>Apunta la cámara a este código</li>
          </ol>
        </div>

        <div className='two-factor-setup-page__qr-container'>
          {qrCode && (
            <img
              src={qrCode}
              alt='Código QR para 2FA'
              className='two-factor-setup-page__qr-image'
            />
          )}
        </div>

        <div className='two-factor-setup-page__manual-entry'>
          <details>
            <summary>¿No puedes escanear el código? Usa entrada manual</summary>
            <div className='manual-entry-content'>
              <p>Ingresa esta clave en tu app de autenticación:</p>
              <div className='manual-key'>
                <code>{manualKey}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(manualKey);
                    toast.success('Clave copiada al portapapeles');
                  }}
                  className='copy-button'
                >
                  📋 Copiar
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>

      <div className='two-factor-setup-page__verification'>
        <h4>Verificar Configuración</h4>
        <p>Ingresa el código de 6 dígitos que aparece en tu app:</p>

        <InputField
          type='text'
          placeholder='123456'
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setVerificationCode(value);
            if (error) setError('');
          }}
          maxLength={6}
          className='two-factor-setup-page__code-input'
          autoFocus
        />

        {error && <ErrorMessage message={error} />}

        <div className='two-factor-setup-page__actions'>
          <MainButton
            onClick={verifyAndEnable}
            disabled={loading || verificationCode.length !== 6}
            color='primary'
            className='two-factor-setup-page__primary-btn'
          >
            {loading ? 'Verificando...' : '✅ Verificar y Habilitar'}
          </MainButton>
          <MainButton
            onClick={() => setCurrentStep(1)}
            color='secondary'
            variant='outlined'
          >
            ← Volver
          </MainButton>
        </div>
      </div>
    </div>
  );

  // Renderizar paso 3: Códigos de respaldo y finalización
  const renderStep3 = () => (
    <div className='two-factor-setup-page__step'>
      <div className='two-factor-setup-page__header'>
        <div className='two-factor-setup-page__icon'>🎉</div>
        <h1>¡2FA Configurado Exitosamente!</h1>
        <p>Tu cuenta ahora está protegida con autenticación en dos pasos</p>
      </div>

      <div className='two-factor-setup-page__success-info'>
        <div className='success-card'>
          <h4>✅ ¿Qué significa esto?</h4>
          <p>A partir de ahora, cuando inicies sesión necesitarás:</p>
          <ul>
            <li>Tu email y contraseña (como siempre)</li>
            <li>Un código de 6 dígitos de tu app de autenticación</li>
          </ul>
        </div>
      </div>

      <div className='two-factor-setup-page__backup-codes'>
        <div className='backup-codes-warning'>
          <h4>⚠️ Códigos de Respaldo Importantes</h4>
          <p>
            <strong>¡GUARDA ESTOS CÓDIGOS EN UN LUGAR SEGURO!</strong>
            <br />
            Si pierdes tu teléfono, puedes usar estos códigos para acceder a tu
            cuenta. Cada código solo puede usarse una vez.
          </p>
        </div>

        <div className='backup-codes-grid'>
          {backupCodes.map((code, index) => (
            <div key={index} className='backup-code'>
              {code}
            </div>
          ))}
        </div>

        <div className='backup-codes-actions'>
          <MainButton
            onClick={() => {
              const codesText = `Códigos de respaldo 2FA - Objetos Perdidos UN\n\n${backupCodes.join('\n')}\n\nGuarda estos códigos en un lugar seguro. Cada código solo puede usarse una vez.`;
              navigator.clipboard.writeText(codesText);
              toast.success('Códigos copiados al portapapeles');
            }}
            color='secondary'
            variant='outlined'
          >
            📋 Copiar Códigos
          </MainButton>

          <MainButton
            onClick={() => {
              const codesText = `Códigos de respaldo 2FA - Objetos Perdidos UN\n\n${backupCodes.join('\n')}\n\nGuarda estos códigos en un lugar seguro. Cada código solo puede usarse una vez.`;
              const blob = new Blob([codesText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'backup-codes-2fa-objetos-perdidos.txt';
              a.click();
              URL.revokeObjectURL(url);
              toast.success('Códigos descargados');
            }}
            color='secondary'
            variant='outlined'
          >
            💾 Descargar Códigos
          </MainButton>
        </div>
      </div>

      <div className='two-factor-setup-page__next-steps'>
        <h4>🔄 Próximos pasos:</h4>
        <ul>
          <li>
            Prueba iniciar sesión en otra pestaña para verificar que funciona
          </li>
          <li>Guarda tus códigos de respaldo en un lugar seguro</li>
          <li>Puedes gestionar tu 2FA desde tu perfil de usuario</li>
        </ul>
      </div>

      <div className='two-factor-setup-page__actions'>
        <MainButton
          onClick={handleFinish}
          color='primary'
          className='two-factor-setup-page__primary-btn'
        >
          🏁 Finalizar Configuración
        </MainButton>
      </div>
    </div>
  );

  if (twoFactorStatus === null) {
    return (
      <>
        <Header />
        <BasicLayout>
          <div className='two-factor-setup-page__loading'>
            <div className='loading-spinner'></div>
            <p>Cargando información de 2FA...</p>
          </div>
        </BasicLayout>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <BasicLayout>
        <div className='two-factor-setup-page'>
          <div className='two-factor-setup-page__progress'>
            <div className='progress-steps'>
              <div
                className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}
              >
                <span>1</span> Introducción
              </div>
              <div
                className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}
              >
                <span>2</span> Configurar
              </div>
              <div
                className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}
              >
                <span>3</span> Completado
              </div>
            </div>
            <div className='progress-bar'>
              <div
                className='progress-fill'
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </BasicLayout>
      <Footer />
    </>
  );
};

export default TwoFactorSetupPage;
