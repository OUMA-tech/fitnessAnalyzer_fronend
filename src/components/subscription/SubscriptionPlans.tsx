import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { request } from '../../utils/request';

interface Plan {
  id: string;
  name: string;
  priceId: string;
  features: string[];
}

export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await request<{ [key: string]: Plan }>({
        url: '/api/stripe/plans',
        method: 'GET'
      });
      setPlans(Object.values(response));
      setError(null);
    } catch (error) {
      setError('Failed to fetch subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    try {
      setSubscribing(true);
      setError(null);
      const response = await request<{ sessionUrl: string }>({
        url: '/api/stripe/create-checkout-session',
        method: 'POST',
        data: { priceId }
      });

      window.location.href = response.sessionUrl;
    } catch (error: any) {
      setError(error.message || 'Failed to start subscription process');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={4}
      >
        {plans.map((plan) => (
          <Card
            key={plan.id}
            sx={{
              width: 300,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <CardHeader
              title={
                <Typography variant="h5" align="center">
                  {plan.name}
                </Typography>
              }
              sx={{ pb: 0 }}
            />
            <CardContent sx={{ flexGrow: 1, pt: 2 }}>
              <List disablePadding>
                {plan.features.map((feature) => (
                  <ListItem key={feature} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircle color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature}
                      primaryTypographyProps={{
                        variant: 'body2'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={subscribing}
                sx={{ mt: 3 }}
              >
                {subscribing ? <CircularProgress size={24} /> : 'Subscribe'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}; 