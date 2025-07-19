import './LoginRegistrationForget.scss';
import { useState } from 'react';
import LoginForm from '../../molecules/loginForm/LoginForm';
import { Login } from '../../utilities/login';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utilities/user';
import { useUserStore } from '../../store/userStore';

const LoginRegistrationForget = () => {
  const [error, setError] = useState(null);
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

  const handleLogin = (email, password) => {
    Login(email, password)
      .then((response) => {
        if (response.status === 200) {
          setError(null);
          handleuserinformation();
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

  return (
    <div className='login__form-container'>
      <LoginForm onSubmit={handleLogin} error={error} />
      <a href='#' className='login__forgot-password'>
        ¿Olvidaste tu contraseña?
      </a>
      <button
        className='login__register'
        onClick={() => console.log(handleSessionClick())}
      >
        Registrate
      </button>
    </div>
  );
};

export default LoginRegistrationForget;
