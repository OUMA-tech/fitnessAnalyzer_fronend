import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const STRAVA_CLIENT_ID = '158986';
const REDIRECT_URI = 'https://fitnessanalyzer-backend.onrender.com/api/strava/callback';
const SCOPE = 'read,activity:read_all';

export default function StravaConnectButton({ userToken }: { userToken: string }) {
  const navigate = useNavigate();
  const handleSkip = () => {
    navigate('/dashboard');
  }
  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}&state=${userToken}&approval_prompt=force`;
  console.log(stravaAuthUrl);
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      gap={4}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          You haven't bound your Strava account
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          To access full training sync features, please connect to Strava.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            href={stravaAuthUrl}
          >
            Bind Strava Account
          </Button>
          <Button variant="outlined" onClick={handleSkip}>
            Skip
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
