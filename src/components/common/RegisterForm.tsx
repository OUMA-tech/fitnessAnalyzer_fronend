import { Alert, Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useState } from 'react';

interface RegisterFormProps {
  onSubmit: (values: { email: string; password: string; username: string }) => Promise<void>;
  loading: boolean;
}

const RegisterForm = ({ onSubmit, loading }: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with values:', { email, password, username });
    setError(null);

    // Validation
    if (!email || !password || !username) {
      setError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Calling onSubmit with values:', { email, password, username });
      await onSubmit({ email, password, username });
    } catch (err) {
      console.error('Error during form submission:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" minWidth="100vw">
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ mt: 10, px: 3, py: 4, borderRadius: 2 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              size="small"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              size="small"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              size="small"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              size="small"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              variant="contained"
              size="small"
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Box>
        </Paper>
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default RegisterForm;