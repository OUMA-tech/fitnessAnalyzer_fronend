import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Container } from '@mui/material';

interface VerificationFormProps {
  email: string;
  onSubmit: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
}

const VerificationForm = ({ email, onSubmit, onResend }: VerificationFormProps) => {
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(code);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await onResend();
      setCountdown(60);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 10, px: 3, py: 4, borderRadius: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Verify Your Email
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
          We've sent a verification code to {email}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            size="small"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            inputProps={{ maxLength: 6 }}
            required
            fullWidth
          />

          <Button
            variant="contained"
            type="submit"
            size="small"
            disabled={code.length !== 6 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>

          <Button
            variant="text"
            onClick={handleResend}
            disabled={countdown > 0 || isLoading}
            sx={{ mt: 1 }}
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerificationForm; 