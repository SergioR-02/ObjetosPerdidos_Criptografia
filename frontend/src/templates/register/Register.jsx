import './Register.scss';
import RegisterForm from '../../molecules/registerForm/RegisterForm';
import RegisterUser from '../../utilities/register';
import { useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { useUserStore } from '../../store/userStore';

const Register = () => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // Si el usuario ya está autenticado, redirigir a home
  if (isAuthenticated) {
    return <Navigate to='/home' replace />;
  }
  const handleSubmit = async (name, email, password, phone, recaptchaToken) => {
    const phoneString = phone.toString();
    try {
      const responsePetition = await RegisterUser(name, email, password, phoneString, recaptchaToken);
      if(responsePetition.message==='Usuario registrado exitosamente'){
        navigate('/login');
      }else{
        toast.error('Algo salio mal');
      }
    } catch (error) {
      toast.error('Algo salio mal');
    }
  };
  return (
    <div className='register'>
      <RegisterForm onSubmit={handleSubmit} />
      <Toaster />
    </div>
  );
};

export default Register;
