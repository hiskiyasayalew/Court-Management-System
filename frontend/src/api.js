import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

// Use full URL for login as well
export const login = async (userName, passWord) => {
  const response = await axios.post('http://localhost:8080/api/login', { userName, passWord });
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};
