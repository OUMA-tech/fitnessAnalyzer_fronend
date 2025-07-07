import { useDispatch } from 'react-redux';
import { LoginForm } from '../../components/common/LoginForm';
import { setUser, setSubscription } from '../../slices/authSlice';
import { login } from '../../services/authAPI';
import { useNavigate } from 'react-router-dom';
import { Alert, Box } from '@mui/material';
import { useState } from 'react';
import StravaConnectButton from '../../components/common/AuthStrava';
// import { getCookies } from '../../features/user/profileAPI';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  isAuthStrava: boolean;
}
interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  planId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  subscription: Subscription;
}

const LoginPage = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [userToken, setUserToken] = useState('');
  const [stravaBind, setStravaBind ] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = async(res: LoginResponse) => {
    const userData = {
      id: res.user.id,
      username: res.user.username,
      token: res.token,
      role: res.user.role,
      isAuthStrava: res.user.isAuthStrava,
      avatar:res.user.avatar,
    };
    setUserToken(userData.token);
    // 1. save to Redux
    dispatch(setUser(userData));
    dispatch(setSubscription(res.subscription));
    // 2. save to localStorage
    localStorage.setItem('auth', JSON.stringify(userData));
    // //3. get avatar cookies
    // await getCookies();

  };

  
  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    setError('');
    try {      
      const data = await login(email, password);
      handleLoginSuccess(data);
      if(data.user.isAuthStrava){
        navigate('/dashboard');
      } else{
        setStravaBind(true);
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return(
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      {!userToken && <LoginForm onSubmit={handleSubmit} />}
      {stravaBind && <StravaConnectButton userToken={userToken}/>}
    </Box> 
  )
};
export default LoginPage;