import axios from "axios";
import API_BASE_URL from "../config/api.js";

const getUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/profile`, {
    withCredentials: true,
  });
  return response.data;
};

export { getUser };
