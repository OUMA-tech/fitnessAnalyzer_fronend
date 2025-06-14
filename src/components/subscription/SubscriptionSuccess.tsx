import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { request } from '../../utils/request';

export const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifySubscription(sessionId);
    } else {
      setError('Invalid session');
      setLoading(false);
    }
  }, [searchParams]);

  const verifySubscription = async (sessionId: string) => {
    try {
      await request({
        url: '/api/stripe/verify-subscription',
        method: 'POST',
        data: { sessionId }
      });
      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to verify subscription');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            mt: 8,
            textAlign: 'center',
            backgroundColor: 'error.light'
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Subscription Error
          </Typography>
          <Typography color="error.dark" paragraph>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/subscription')}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper
        sx={{
          p: 4,
          mt: 8,
          textAlign: 'center',
          backgroundColor: 'success.light'
        }}
      >
        <CheckCircle
          color="success"
          sx={{ fontSize: 64, mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          Thank You!
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Your subscription has been successfully activated.
        </Typography>
        <Typography color="text.secondary" paragraph>
          You now have access to all premium features. Start exploring them now!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Container>
  );
}; 