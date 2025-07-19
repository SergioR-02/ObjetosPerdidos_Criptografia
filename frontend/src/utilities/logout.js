import axios from "axios";
import API_BASE_URL from "../config/api.js";

const Logout = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    throw error;
  }
};

export default Logout;
