import './LoginForm.scss';
import { useState } from 'react';
import MainButton from '../../atoms/mainButton/MainButton';
import InputField from '../../atoms/inputField/InputField';
import ErrorMessage from '../../atoms/errorMessage/ErrorMessage';

const LoginForm = ({ onSubmit, error }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(name, password);
      }}
      className='login-form'
    >
      <h1 className='login-form__title'>Login</h1>
      <div className='login-form__fields'>
        <InputField
          label='CORREO'
          type='email'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          label='PASSWORD'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <MainButton
        text='Iniciar Sesión'
        type='submit'
        className='login-form__button'
      />
      <ErrorMessage message={error} className='login-form__errorMessage' />
    </form>
  );
};

export default LoginForm;
