// utils/handleAxiosError.ts

import { toast } from 'react-toastify';

export const handleAxiosError = (err: any, fallbackMessage = 'Something went wrong ❌') => {
  const status = err?.response?.status;
  const message = err?.response?.data?.message || fallbackMessage;

  if (status === 401) {
    toast.error('Session expired, please log in again.');
    // 这里可以重定向或清除 token
    localStorage.clear(); 
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  } else if (status === 403) {
    toast.error('You do not have permission to perform this action.');
  } else if (status === 500) {
    toast.error('Server error, please try again later.');
  } else {
    toast.error(message);
  }

  console.error('Axios error:', err);
};
