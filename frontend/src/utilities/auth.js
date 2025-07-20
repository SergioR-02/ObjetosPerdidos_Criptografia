import { refreshToken } from './login';
import { getUser } from './user';
import { useUserStore } from '../store/userStore';

export const checkAuthStatus = async () => {
  try {
    // Intentamos refrescar el token
    const refreshResponse = await refreshToken();
    
    // Si el refresh token no es válido, no continuamos
    if (refreshResponse.status !== 200) {
      return false;
    }

    // Si el refresh token es válido, obtenemos la información del usuario
    const userData = await getUser();

    // Obtenemos las funciones del store
    const {
      setIsAuthenticated,
      setUserId,
      setUserName,
      setUserEmail,
      setUserPhone,
      setUserRole,
    } = useUserStore.getState();

    // Actualizamos el estado
    setIsAuthenticated(true);
    setUserId(userData.user_id);
    setUserName(userData.name);
    setUserEmail(userData.email);
    setUserPhone(userData.phone_number);
    setUserRole(userData.role);

    return true;
  } catch (error) {
    // Solo logeamos errores que no sean 401 (no autenticado es normal)
    if (error.response?.status !== 401) {
      console.error('Error al verificar el estado de autenticación:', error);
    }
    // Para errores 401, simplemente retornamos false sin logging
    return false;
  }
}; 