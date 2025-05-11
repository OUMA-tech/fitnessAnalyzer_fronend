import { RegisterForm } from '../../components/common/RegisterForm';
import { register } from '../../features/common/authAPI';

export const RegisterPage = () => {

    const handleRegister = async ({ email, password, username }: { email: string; password: string; username: string }) => {
        try {
            const response = await register({username, email, password});
        
            return { success: true, message: response.data.message || 'register success!' };
          } catch (error: any) {
            const message =
              error.response?.data?.message || 'register failed';
            return { success: false, message };
          }

    }
  return (
    <>
      <RegisterForm onSubmit={handleRegister}/>
    </>
  )
}