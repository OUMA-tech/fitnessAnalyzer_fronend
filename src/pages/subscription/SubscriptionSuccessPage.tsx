import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import { CheckCircle, Star } from '@mui/icons-material';
import { setSubscription } from '../../slices/authSlice';
import { useUserSubscription } from '../../hooks/useUserSubscription';
import { SubscriptionService } from '../../services/subscriptionService';

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshSubscription } = useUserSubscription();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifySubscription(sessionId);
    } else {
      setError('Invalid session - missing session ID');
      setLoading(false);
    }
  }, [searchParams]);

  const verifySubscription = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Verify the subscription with backend
      const response = await SubscriptionService.verifySubscription(sessionId);

      // Update Redux state
      dispatch(setSubscription(response.subscription));
      
      // Refresh subscription data
      await refreshSubscription();
      
      setLoading(false);
    } catch (error: any) {
      console.error('Subscription verification error:', error);
      setError(error.response?.data?.message || 'Failed to verify subscription');
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToSubscription = () => {
    navigate('/subscription');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          gap={3}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Verifying your subscription...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: 'error.light',
            borderRadius: 3
          }}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Subscription Error
          </Typography>
          <Typography color="error.dark" paragraph sx={{ mb: 4 }}>
            {error}
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              onClick={() => navigate('/subscription')}
              sx={{ minWidth: 120 }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              sx={{ minWidth: 120 }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }}
        />
        
        <Box position="relative" zIndex={1}>
          <CheckCircle
            sx={{ 
              fontSize: 80, 
              mb: 3,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}
          />
          
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to Pro! 🎉
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Your subscription has been successfully activated
          </Typography>
          
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              p: 3,
              mb: 4,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              You now have access to all premium features:
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
              {['Advanced Analytics', 'Unlimited Workouts', 'Personal AI Trainer', 'Nutrition Tracking'].map((feature) => (
                <Box
                  key={feature}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  <Star sx={{ fontSize: 16 }} />
                  {feature}
                </Box>
              ))}
            </Box>
          </Box>
          
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={handleGoToDashboard}
              sx={{
                backgroundColor: 'white',
                color: 'success.main',
                '&:hover': {
                  backgroundColor: 'grey.100'
                },
                minWidth: 160
              }}
            >
              Start Exploring
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleGoToSubscription}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                minWidth: 160
              }}
            >
              Manage Subscription
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SubscriptionSuccessPage; 