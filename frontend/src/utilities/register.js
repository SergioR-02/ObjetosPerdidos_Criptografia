import axios from "axios";
import API_BASE_URL from "../config/api.js";

const RegisterUser = async (name, email, password, phone_number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      {
        email,
        password,
        name,
        phone_number,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

export default RegisterUser;
