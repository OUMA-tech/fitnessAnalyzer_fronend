import { RegisterForm } from '../../components/common/RegisterForm';
import { register } from '../../features/common/authAPI';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {

  const navigate = useNavigate();

  const handleRegister = async ({ email, password, username }: { email: string; password: string; username: string }) => { 
    try {
      const response = await register({username, email, password});
      console.log(response);
      navigate('/login');
      return { success: true, message: response.message || 'register success!' };
    } catch (error: any) {
      const message =
        error.response?.message || 'register failed';
      return { success: false, message };
    }

  }
  return (
    <>
      <RegisterForm onSubmit={handleRegister}/>
    </>
  )
}