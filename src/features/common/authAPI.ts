import axios from 'axios';
import { clearUser } from '../../slices/authSlice';
import { Dispatch } from 'redux';
import { NavigateFunction } from 'react-router-dom';

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

export const handleLogout = (dispatch: Dispatch,
  navigate: NavigateFunction) => {
  localStorage.clear();
  dispatch(clearUser());
  navigate('/');
};