import axios from 'axios';
import API_BASE_URL from "../config/api.js";

export const getFilteredObjects = async (userId, keyword, location, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/objects/filters`, {
      withCredentials: true,
      params: {
        keyword: keyword,
        location: location,
        startDate: startDate,
        endDate: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los objetos filtrados:', error);
    throw error;
  }
};