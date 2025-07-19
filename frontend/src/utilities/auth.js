import { refreshToken } from './login';
import { getUser } from './user';
import { useUserStore } from '../store/userStore';

export const checkAuthStatus = async () => {
  try {
    // Intentamos refrescar el token
    await refreshToken();

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
    console.error('Error al verificar el estado de autenticación:', error);
    return false;
  }
}; 