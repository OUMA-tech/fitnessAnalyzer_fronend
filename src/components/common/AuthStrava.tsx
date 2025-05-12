import { Button } from "@mui/material";

const STRAVA_CLIENT_ID = '158986';
const REDIRECT_URI = 'http://localhost:5000/api/strava/callback';
const SCOPE = 'read,activity:read_all';


export default function StravaConnectButton({ userToken }: { userToken: string }) {

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}&state=${userToken}`;
  return (
    <Button
      variant="contained"
      color="secondary"
      href={stravaAuthUrl}
    >
      Bind Strava Account
    </Button>
  );
}
