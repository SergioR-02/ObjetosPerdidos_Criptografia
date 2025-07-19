import axios from 'axios';
import API_BASE_URL from "../config/api.js";

export const getFilteredObjects = async (userId, filterId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/objects/filter/${filterId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los objetos filtrados:', error);
    throw error;
  }
};