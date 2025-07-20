import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import MainButton from '../../atoms/mainButton/MainButton';
import InputField from '../../atoms/inputField/InputField';
import ErrorMessage from '../../atoms/errorMessage/ErrorMessage';
import API_BASE_URL from '../../config/api';
import axios from 'axios';
import './TwoFactorManagement.scss';

const TwoFactorManagement = () => {
  const navigate = useNavigate();
  const [twoFactorStatus, setTwoFactorStatus] = useState({
    enabled: false,
    hasBackupCodes: false,
    backupCodesCount: 0,
  });
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [showRegenerateForm, setShowRegenerateForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newBackupCodes, setNewBackupCodes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar estado de 2FA al montar el componente
  useEffect(() => {
    loadTwoFactorStatus();
  }, []);

  const loadTwoFactorStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/2fa/status`, {
        withCredentials: true,
      });
      setTwoFactorStatus(response.data);
    } catch (error) {
      console.error('Error cargando estado 2FA:', error);
      // Establecer estado por defecto cuando hay error
      setTwoFactorStatus({
        enabled: false,
        hasBackupCodes: false,
        backupCodesCount: 0,
      });
      toast.error('Error al cargar información de 2FA');
    }
  };

  const handleDisable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Ingresa un código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${API_BASE_URL}/2fa/disable`,
        { code: verificationCode },
        { withCredentials: true },
      );

      toast.success('2FA deshabilitado exitosamente');
      setShowDisableForm(false);
      setVerificationCode('');
      await loadTwoFactorStatus();
    } catch (error) {
      console.error('Error deshabilitando 2FA:', error);
      setError(error.response?.data?.message || 'Error al deshabilitar 2FA');
      toast.error('Código de verificación inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Ingresa un código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/2fa/regenerate-backup-codes`,
        { code: verificationCode },
        { withCredentials: true },
      );

      setNewBackupCodes(response.data.backupCodes);
      toast.success('Códigos de respaldo regenerados');
      setVerificationCode('');
      await loadTwoFactorStatus();
    } catch (error) {
      console.error('Error regenerando códigos:', error);
      setError(error.response?.data?.message || 'Error al regenerar códigos');
      toast.error('Código de verificación inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = () => {
    navigate('/setup-2fa');
  };

  // Si 2FA no está habilitado
  if (!twoFactorStatus.enabled) {
    return (
      <div className='two-factor-management'>
        <div className='two-factor-management__status'>
          <div className='two-factor-management__status-icon two-factor-management__status-icon--disabled'>
            🔒
          </div>
          <h3>Autenticación en Dos Pasos</h3>
          <p>
            La autenticación en dos pasos está <strong>deshabilitada</strong>
          </p>
          <p className='two-factor-management__description'>
            Agrega una capa adicional de seguridad a tu cuenta. Una vez
            habilitada, necesitarás tu contraseña y un código de tu teléfono
            para iniciar sesión.
          </p>

          <div className='two-factor-management__actions'>
            <MainButton onClick={handleSetup2FA} color='primary'>
              🚀 Habilitar 2FA
            </MainButton>
          </div>
        </div>
      </div>
    );
  }

  // Si 2FA está habilitado
  return (
    <div className='two-factor-management'>
      <div className='two-factor-management__status'>
        <div className='two-factor-management__status-icon two-factor-management__status-icon--enabled'>
          🛡️
        </div>
        <h3>Autenticación en Dos Pasos</h3>
        <p>
          La autenticación en dos pasos está <strong>habilitada</strong>
        </p>
        <p className='two-factor-management__description'>
          Tu cuenta está protegida con autenticación en dos pasos.
          {twoFactorStatus.hasBackupCodes && (
            <>
              {' '}
              Tienes {twoFactorStatus.backupCodesCount} códigos de respaldo
              disponibles.
            </>
          )}
        </p>
      </div>

      <div className='two-factor-management__actions'>
        <MainButton
          onClick={() => setShowRegenerateForm(true)}
          color='secondary'
          variant='outlined'
        >
          Regenerar Códigos de Respaldo
        </MainButton>

        <MainButton
          onClick={() => setShowDisableForm(true)}
          color='danger'
          variant='outlined'
        >
          Deshabilitar 2FA
        </MainButton>
      </div>

      {/* Formulario para deshabilitar 2FA */}
      {showDisableForm && (
        <div className='two-factor-management__form'>
          <h4>Deshabilitar Autenticación en Dos Pasos</h4>
          <p>
            Para deshabilitar 2FA, ingresa un código de verificación de tu
            aplicación de autenticación:
          </p>

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

          <div className='two-factor-management__form-actions'>
            <MainButton
              onClick={handleDisable2FA}
              disabled={loading || verificationCode.length !== 6}
              color='danger'
            >
              {loading ? 'Deshabilitando...' : 'Deshabilitar 2FA'}
            </MainButton>
            <MainButton
              onClick={() => {
                setShowDisableForm(false);
                setVerificationCode('');
                setError('');
              }}
              color='secondary'
              variant='outlined'
            >
              Cancelar
            </MainButton>
          </div>
        </div>
      )}

      {/* Formulario para regenerar códigos de respaldo */}
      {showRegenerateForm && (
        <div className='two-factor-management__form'>
          <h4>Regenerar Códigos de Respaldo</h4>
          <p>
            Para regenerar tus códigos de respaldo, ingresa un código de
            verificación de tu aplicación:
          </p>

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

          <div className='two-factor-management__form-actions'>
            <MainButton
              onClick={handleRegenerateBackupCodes}
              disabled={loading || verificationCode.length !== 6}
              color='primary'
            >
              {loading ? 'Regenerando...' : 'Regenerar Códigos'}
            </MainButton>
            <MainButton
              onClick={() => {
                setShowRegenerateForm(false);
                setVerificationCode('');
                setError('');
              }}
              color='secondary'
              variant='outlined'
            >
              Cancelar
            </MainButton>
          </div>
        </div>
      )}

      {/* Mostrar nuevos códigos de respaldo */}
      {newBackupCodes.length > 0 && (
        <div className='two-factor-management__new-codes'>
          <h4>Nuevos Códigos de Respaldo</h4>
          <div className='two-factor-management__warning'>
            <p>
              ⚠️ Guarda estos códigos en un lugar seguro. Los códigos anteriores
              ya no son válidos.
            </p>
          </div>

          <div className='two-factor-management__codes-grid'>
            {newBackupCodes.map((code, index) => (
              <div key={index} className='two-factor-management__backup-code'>
                {code}
              </div>
            ))}
          </div>

          <div className='two-factor-management__codes-actions'>
            <MainButton
              onClick={() => {
                const codesText = newBackupCodes.join('\n');
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
                const codesText = newBackupCodes.join('\n');
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
              Descargar
            </MainButton>

            <MainButton onClick={() => setNewBackupCodes([])} color='primary'>
              Entendido
            </MainButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorManagement;
