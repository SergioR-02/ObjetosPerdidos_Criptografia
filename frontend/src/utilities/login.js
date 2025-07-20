import axios from "axios";
import API_BASE_URL from "../config/api.js";
import Logout from "./logout";

const Login = async (email, password, recaptchaToken) => {
  if (!recaptchaToken) {
    throw new Error('reCAPTCHA token es requerido');
  }
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        email: email,
        password: password,
        recaptchaToken: recaptchaToken,
      },
      {
        withCredentials: true,
      }
    );

    // Si el login es exitoso, configuramos el refresh automático
    if (response.status === 200) {
      setupTokenRefresh();
    }
    return response;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    // Solo logeamos errores que no sean 401 (no tener refresh token es normal)
    if (error.response?.status !== 401) {
      console.error('Error refreshing token:', error);
    }
    throw error;
  }
};

let refreshInterval;

const setupTokenRefresh = (intervalMs = 5 * 60 * 1000) => { // 5 minutos por defecto
  // Limpiar el intervalo anterior si existe
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  // Crear un nuevo intervalo
  refreshInterval = setInterval(async () => {
    try {
      await refreshToken();
    } catch (error) {
      console.error('Error en el refresh automático:', error);
      // Si hay un error, detener el intervalo
      clearInterval(refreshInterval);
      //TODO: Desloguear el usuario cuando el refresh token expire
      Logout();
      window.location.href = '/login';
    }
  }, intervalMs);

  // Retornar una función para limpiar el intervalo
  return () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  };
};

const clearTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

export default Login;
export { refreshToken, setupTokenRefresh, clearTokenRefresh };
