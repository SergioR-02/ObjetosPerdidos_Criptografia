import React from 'react';
import './Login.scss';
import LoginRegistrationForget from '../../organisms/loginRegistrationForget/LoginRegistrationForget';
import { useUserStore } from '../../store/userStore';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to='/home' replace />;
  }

  return (
    <div className='login'>
      <LoginRegistrationForget />
    </div>
  );
};

export default Login;
