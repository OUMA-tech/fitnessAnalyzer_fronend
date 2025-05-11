import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import Layout from "./Layout"
import { useState } from 'react';

interface Props {
  onSubmit: (data: { email: string; password: string; username: string }) => void;
}

export const RegisterForm = ({ onSubmit }: Props) => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return { success: false, message: 'invalid email' };
        }
      
        if (password !== confirmPassword) {
          return { success: false, message: "password doesn't match" };
        }
      
        if (password.length < 6) {
          return { success: false, message: 'password at least 6 length' };
        }
        onSubmit({email, password, username});
    }
  return (
    <Layout title="ALBOOK" subTitle="Sign Up Now">
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
    </Layout>
  )
}