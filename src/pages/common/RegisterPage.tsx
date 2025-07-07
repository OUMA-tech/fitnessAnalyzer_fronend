import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box } from '@mui/material';
import RegisterForm from '../../components/common/RegisterForm';
import VerificationForm from '../../components/common/VerificationForm';
import Layout from '../../components/common/Layout';
import { sendVerification, register } from '../../services/authAPI';

type Step = 'form' | 'verification';

interface RegisterData {
  email: string;
  password: string;
  username: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSubmit = async (values: RegisterData) => {
    console.log('Register submit called with values:', values);
    setLoading(true);
    setError(null);
    
    try {
      const response = await sendVerification(values.email);
      console.log('Verification code sent successfully:', response);

      setRegisterData(values);
      setStep('verification');
      console.log('Step changed to verification');
    } catch (error: any) {
      console.error('Error during registration:', error);
      setError(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (code: string) => {
    if (!registerData) {
      console.error('No register data found');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await register(registerData, code);
      console.log('Registration successful:', response);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!registerData) {
      console.error('No register data found for resend');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await sendVerification(registerData.email);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  console.log('Current step:', step);
  console.log('Register data:', registerData);

  return (
    <>
      <Layout />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        {step === 'form' ? (
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            loading={loading}
          />
        ) : (
          <VerificationForm
            email={registerData?.email || ''}
            onSubmit={handleVerificationSubmit}
            onResend={handleResendCode}
          />
        )}
        
        {error && (
          <Box sx={{ maxWidth: 'xs', mx: 'auto', mt: 2 }}>
            <Alert severity="error">
              {error}
            </Alert>
          </Box>
        )}
      </Box>
    </>
  );
};

export default RegisterPage;