import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { Cancel, ArrowBack } from '@mui/icons-material';

const SubscriptionCancelPage = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/subscription');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
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
          <Cancel
            sx={{ 
              fontSize: 80, 
              mb: 3,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}
          />
          
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Payment Cancelled
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            No worries! You can upgrade anytime
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
              You're still on the free plan with access to:
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
              {['Basic Workout Tracking', 'Limited Exercise Library', 'Community Access'].map((feature) => (
                <Box
                  key={feature}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  {feature}
                </Box>
              ))}
            </Box>
          </Box>
          
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
              onClick={handleTryAgain}
              sx={{
                backgroundColor: 'white',
                color: 'warning.main',
                '&:hover': {
                  backgroundColor: 'grey.100'
                },
                minWidth: 160
              }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleGoToDashboard}
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
              Continue with Free
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SubscriptionCancelPage; 