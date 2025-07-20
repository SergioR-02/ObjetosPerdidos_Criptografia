import './LoginForm.scss';
import { useState, useRef } from 'react';
import MainButton from '../../atoms/mainButton/MainButton';
import InputField from '../../atoms/inputField/InputField';
import ErrorMessage from '../../atoms/errorMessage/ErrorMessage';
import RecaptchaComponent from '../../components/Recaptcha/Recaptcha';
import { toast } from 'sonner';

const LoginForm = ({ onSubmit, error }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        
        if (!recaptchaToken) {
          toast.error('Por favor completa la verificación reCAPTCHA');
          return;
        }

        const formData = {
          email: name,  // El campo se llama 'name' en el frontend pero debe ser 'email' para el backend
          password,
          recaptchaToken
        };
        
        onSubmit(formData);
        
        // Reset reCAPTCHA after submit
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setRecaptchaToken(null);
        }
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
        <div className='login-form__recaptcha'>
          <RecaptchaComponent
            ref={recaptchaRef}
            onChange={handleRecaptchaChange}
            onExpired={handleRecaptchaExpired}
          />
        </div>
      </div>
      <MainButton
        text='Iniciar Sesión'
        type='submit'
        className='login-form__button'
        disabled={!recaptchaToken}
      />
      <ErrorMessage message={error} className='login-form__errorMessage' />
    </form>
  );
};

export default LoginForm;
