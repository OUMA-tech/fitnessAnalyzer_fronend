import axios from 'axios';

export const login = async (email: string, password: string) => {
  const res = await axios.post('http://localhost:5000/api/auth/login', {
    email,
    password,
  }, { withCredentials: true });

  return res.data;
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post('http://localhost:5000/api/auth/register', userData);
  return res.data;
};