import axios from 'axios';
import API_BASE_URL from "../config/api.js";

export const updateUserInfo = async (user_id, name, email, phone_number) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/user/${user_id}/profile/update`, { name, email, phone_number }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la información del usuario:', error);
    throw error;
  }
};

