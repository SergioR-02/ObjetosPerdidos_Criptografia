import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

// Componente para proteger rutas públicas (login, register, landpage)
// Si el usuario ya está autenticado, lo redirige a /home
const PublicRoute = ({ children }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  
  return isAuthenticated ? <Navigate to='/home' replace /> : children;
};

export default PublicRoute;
