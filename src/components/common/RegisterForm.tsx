import { Alert, Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import Layout from "./Layout"
import { useState } from 'react';

interface Props {
  onSubmit: (data: { email: string; password: string; username: string }) => Promise<{ success: boolean; message: string }>;
}

export const RegisterForm = ({ onSubmit }: Props) => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [feedback, setFeedback] = useState<{ success: boolean, message: string } | null>(null);
    
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFeedback({ success: false, message: 'invalid email' });
        return ;
      }
    
      if (password !== confirmPassword) {
        setFeedback({ success: false, message: "password doesn't match" });
        return ;
      }
    
      if (password.length < 6) {
        setFeedback({ success: false, message: 'password at least 6 length' });
        return ;
      }
      console.log("Submitting to onSubmit...");
      const result = await onSubmit({ email, password, username });
      setFeedback(result);
    }
  return (
    <>
    <Layout title="FitTrack" />
      <Box display={'flex'} flexDirection={'column'} alignItems="center" minHeight="100vh" minWidth="100vw">
      <Container maxWidth="xs">
          <Paper elevation={3} sx={{ mt: 10, px: 3, py: 4, borderRadius: 2 }}>
              <Typography variant="h6" align="center" gutterBottom>
              Sign Up
              </Typography>
              <Box
              component="form"
              onSubmit={handleRegister}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <TextField size="small" label="username" type="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)} 
                required fullWidth />
                <TextField size="small" label="Email" type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required fullWidth />
                <TextField size="small" label="Password" type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required fullWidth />
                <TextField size="small" label="ConfirmPassword" type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required fullWidth />
                <Button variant="contained" size="small" type="submit">
                    Sign Up
                </Button>
              </Box>
          </Paper>
      </Container>
      {feedback && (
        <Alert
        severity={feedback.success ? 'success' : 'error'}
        sx={{ mt: 2, fontSize: '1.15rem', borderRadius: 2, }}
        
      >
        {feedback.message}
      </Alert>
      )}
      </Box>
      </>
  )
  
}