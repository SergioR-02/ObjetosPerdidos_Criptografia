import axios from 'axios';
import API_BASE_URL from "../config/api.js";

export const deleteReport = async (userId, reportId) => {
  console.log(userId, reportId);
  try {
    const response = await axios.delete(`${API_BASE_URL}/user/${userId}/reports/${reportId}`, {
      withCredentials: true,
    })
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el reporte:', error);
    throw error;
  }
};

