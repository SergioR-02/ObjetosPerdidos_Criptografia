import axios from 'axios';
import API_BASE_URL from "../config/api.js";

// Si necesitas un método para obtener todos los objetos:
export const getObjects = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/objects`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener objetos:", error);
    throw error;
  }
};

