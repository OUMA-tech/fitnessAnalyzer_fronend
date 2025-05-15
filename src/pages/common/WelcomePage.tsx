import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Stack, Paper } from "@mui/material";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4, textAlign: 'center', width: '100%' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to FitTrack
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and analyze your fitness journey
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
          <Button onClick={() => navigate("/login")} variant="contained">
            Login
          </Button>
          <Button onClick={() => navigate("/register")} variant="outlined">
            Register
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
