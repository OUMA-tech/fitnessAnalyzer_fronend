import Layout from "./Layout"
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useState } from 'react';


interface Props {
  onSubmit: (data: { email: string; password: string }) => void;
}

export const LoginForm = ({ onSubmit }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ email, password });
    }


    return (
      <>
          <Layout title="ALBOOK" subTitle="Signin">Login</Layout>
          <Container maxWidth="xs">
          <Paper elevation={3} sx={{ mt: 10, px: 3, py: 4, borderRadius: 2 }}>
              <Typography variant="h6" align="center" gutterBottom>
              Sign In
              </Typography>
              <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              <Button variant="contained" size="small" type="submit">
                  Login
              </Button>
              </Box>
          </Paper>
          </Container>
    </>
  )
}
