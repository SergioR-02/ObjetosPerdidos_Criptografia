import './RegisterForm.scss';
import { useState, useRef } from 'react';
import MainButton from '../../atoms/mainButton/MainButton';
import InputField from '../../atoms/inputField/InputField';
import { toast } from 'sonner';
import RecaptchaComponent from '../../components/Recaptcha/Recaptcha';

const RegisterForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
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
        if (
          name === '' ||
          email === '' ||
          password === '' ||
          password.length < 8 ||
          phone === ''
        ) {
          toast.error(
            'Todos los campos son requeridos y la contraseña debe ser de 8 caracteres minimo',
          );
          return;
        }
        
        if (!recaptchaToken) {
          toast.error('Por favor completa la verificación reCAPTCHA');
          return;
        }
        
        onSubmit(name, email, password, phone, recaptchaToken);
      }}
      className='register-form'
    >
      <h1 className='register-form__title'>Crear nueva cuenta</h1>
      <div className='register-form__fields'>
        <InputField
          label='Nombre'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          label='Teléfono'
          type='number'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <InputField
          label='Correo'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label='Contraseña'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className='register-form__password-info'>
          La contraseña debe ser de 8 caracteres minimo
        </p>
        
        <div className='register-form__recaptcha'>
          <RecaptchaComponent
            ref={recaptchaRef}
            onChange={handleRecaptchaChange}
            onExpired={handleRecaptchaExpired}
          />
        </div>
      </div>
      <MainButton
        text='Crear cuenta'
        type='submit'
        onClick={() => {}}
        className='register-form__button'
      />
    </form>
  );
};

export default RegisterForm;
