import axios from 'axios';
import { clearUser } from '../../slices/authSlice';
import { Dispatch } from 'redux';
import { NavigateFunction } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(apiBaseUrl);
export const login = async (email: string, password: string) => {
  const res = await axios.post(`${apiBaseUrl}/api/auth/login`, {
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
  const res = await axios.post(`${apiBaseUrl}/api/auth/register`, userData);
  return res.data;
};

export const handleLogout = (dispatch: Dispatch,
  navigate: NavigateFunction) => {
  localStorage.clear();
  dispatch(clearUser());
  navigate('/');
};