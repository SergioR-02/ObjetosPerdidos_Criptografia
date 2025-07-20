import './LoginRegistrationForget.scss';
import { useState } from 'react';
import LoginForm from '../../molecules/loginForm/LoginForm';
import TwoFactorVerification from '../../components/TwoFactor/TwoFactorVerification';
import Login from '../../utilities/login';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utilities/user';
import { useUserStore } from '../../store/userStore';

const LoginRegistrationForget = () => {
  const [error, setError] = useState(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: '',
    recaptchaToken: '',
  });
  const navigate = useNavigate();
  const {
    setUserId,
    setUserName,
    setUserEmail,
    setUserPhone,
    setUserRole,
    setIsAuthenticated,
  } = useUserStore();

  const handleSessionClick = () => {
    navigate('/register');
  };

  const handleLogin = (formData) => {
    const { email, password, recaptchaToken } = formData;

    Login(email, password, recaptchaToken)
      .then((response) => {
        if (response.status === 200) {
          setError(null);

          // Verificar si requiere 2FA
          if (response.data.requires2FA) {
            // Guardar credenciales para el paso de 2FA
            setLoginCredentials({ email, password, recaptchaToken });
            setRequires2FA(true);
          } else {
            // Login normal sin 2FA
            handleuserinformation();
          }
        } else {
          setError('Credenciales Incorrectas');
        }
      })
      .catch((error) => {
        console.log(error);
        setError('Credenciales Incorrectas');
      });
  };

  const handleuserinformation = () => {
    getUser()
      .then((response) => {
        console.log(response);
        handleuserseter(response);
        navigate('/home');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleuserseter = (response) => {
    setIsAuthenticated(true);
    setUserId(response.user_id);
    setUserName(response.name);
    setUserEmail(response.email);
    setUserPhone(response.phone_number);
    setUserRole(response.role);
  };

  const handle2FASuccess = () => {
    // Limpiar el estado de 2FA
    setRequires2FA(false);
    setLoginCredentials({ email: '', password: '', recaptchaToken: '' });
    setError(null);

    // Continuar con el flujo normal de login
    handleuserinformation();
  };

  const handle2FACancel = () => {
    // Volver al formulario de login
    setRequires2FA(false);
    setLoginCredentials({ email: '', password: '', recaptchaToken: '' });
    setError(null);
  };

  return (
    <div className='login__form-container'>
      {requires2FA ? (
        <TwoFactorVerification
          email={loginCredentials.email}
          password={loginCredentials.password}
          recaptchaToken={loginCredentials.recaptchaToken}
          onSuccess={handle2FASuccess}
          onCancel={handle2FACancel}
        />
      ) : (
        <>
          <LoginForm onSubmit={handleLogin} error={error} />
          <a href='#' className='login__forgot-password'>
            ¿Olvidaste tu contraseña?
          </a>
          <button className='login__register' onClick={handleSessionClick}>
            Registrate
          </button>
        </>
      )}
    </div>
  );
};

export default LoginRegistrationForget;
