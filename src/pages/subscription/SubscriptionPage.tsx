import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  CheckCircle,
  Cancel,
  Upgrade,
  History,
  CreditCard,
  CalendarToday,
  Info
} from '@mui/icons-material';
import { 
  SubscriptionService, 
  SubscriptionPlan, 
  CurrentSubscription, 
  SubscriptionHistory 
} from '../../services/subscriptionService';
import { SubscriptionIndicator } from '../../components/subscription/SubscriptionIndicator';
import { RootState } from '../../store/store';
import Layout from '../../components/common/Layout';

const SubscriptionPage = () => {
  // Get subscription from Redux store
  const reduxSubscription = useSelector((state: RootState) => state.auth.subscription);
  
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistory[]>([]);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have subscription data in Redux, use it immediately
    if (reduxSubscription) {
      // Map Redux subscription status to CurrentSubscription status
      const mapStatus = (status: string): 'active' | 'canceled' | 'past_due' | 'incomplete' => {
        switch (status) {
          case 'active':
            return 'active';
          case 'canceled':
            return 'canceled';
          case 'past_due':
            return 'past_due';
          case 'incomplete':
          case 'incomplete_expired':
            return 'incomplete';
          default:
            return 'incomplete';
        }
      };

      setCurrentSubscription({
        id: reduxSubscription.id,
        stripeSubscriptionId: reduxSubscription.id,
        planName: reduxSubscription.planId === 'pro' ? 'Pro Plan' : 'Free Plan',
        status: mapStatus(reduxSubscription.status),
        currentPeriodStart: new Date().toISOString(), // We'll need to get this from API
        currentPeriodEnd: reduxSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: reduxSubscription.cancelAtPeriodEnd
      });
      setLoading(false);
    } else {
      // If no Redux subscription, fetch from API
      fetchSubscriptionData();
    }
    
    // Always fetch additional data (plans, history) - but not subscription data
    fetchAdditionalData();
  }, [reduxSubscription]);

  const fetchAdditionalData = async () => {
    try {
      setError(null);

      // Fetch plans and history in parallel
      const [history, plans] = await Promise.all([
        SubscriptionService.getSubscriptionHistory(),
        SubscriptionService.getAvailablePlans()
      ]);

      setSubscriptionHistory(history);
      setAvailablePlans(plans);
    } catch (err) {
      console.error('Error fetching additional subscription data:', err);
      setError('Failed to load some subscription information');
    }
  };

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all subscription data in parallel
      const [subscription, history, plans] = await Promise.all([
        SubscriptionService.getCurrentSubscription(),
        SubscriptionService.getSubscriptionHistory(),
        SubscriptionService.getAvailablePlans()
      ]);

      setCurrentSubscription(subscription);
      setSubscriptionHistory(history);
      setAvailablePlans(plans);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      setError('Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    try {
      setUpgrading(true);
      setError(null);

      const response = await SubscriptionService.createSubscription({
        priceId: plan.priceId
      });
      console.log('response', response.sessionUrl);

      window.location.href = response.sessionUrl;
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('Failed to create subscription. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    try {
      setError(null);
      const success = await SubscriptionService.cancelSubscription(
        currentSubscription.stripeSubscriptionId
      );

      if (success) {
        // Refresh subscription data
        await fetchSubscriptionData();
      } else {
        setError('Failed to cancel subscription. Please try again.');
      }
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'canceled':
        return 'error';
      case 'past_due':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Layout/>
      <Typography variant="h4" component="h1" gutterBottom>
        Subscription Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Current Subscription Status */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Current Subscription"
          avatar={<CreditCard color="primary" />}
          action={
            !currentSubscription && (
              <SubscriptionIndicator variant="chip" showMenu />
            )
          }
        />
        <CardContent>
          {currentSubscription ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {currentSubscription.planName}
                  </Typography>
                  <Chip
                    label={currentSubscription.status.toUpperCase()}
                    color={getStatusColor(currentSubscription.status) as any}
                    sx={{ mb: 2 }}
                  />
                  {currentSubscription.cancelAtPeriodEnd && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Your subscription will be canceled at the end of the current billing period.
                    </Alert>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <CalendarToday fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Current Period
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(currentSubscription.currentPeriodStart)} - {formatDate(currentSubscription.currentPeriodEnd)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    startIcon={<Upgrade />}
                    onClick={() => setShowUpgradeDialog(true)}
                  >
                    Change Plan
                  </Button>
                  {currentSubscription.status === 'active' && !currentSubscription.cancelAtPeriodEnd && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={handleCancelSubscription}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No active subscription
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You're currently on the free plan. Upgrade to unlock all features.
              </Typography>
              <Box display="flex" justifyContent="center" gap={2}>
                <SubscriptionIndicator variant="chip" showMenu />
                <Button
                  variant="contained"
                  startIcon={<Upgrade />}
                  onClick={() => setShowUpgradeDialog(true)}
                >
                  Upgrade Now
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Available Plans"
          avatar={<Info color="primary" />}
        />
        <CardContent>
          <Grid container spacing={3}>
            {availablePlans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    ...(plan.id.includes('pro') && {
                      borderColor: 'primary.main',
                      borderWidth: 2
                    })
                  }}
                >
                  {plan.id.includes('pro') && (
                    <Chip
                      label="RECOMMENDED"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" component="div" gutterBottom>
                      ${plan.price}
                      <Typography component="span" variant="subtitle1" color="text.secondary">
                        /{plan.interval}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {plan.description}
                    </Typography>
                    <List dense>
                      {plan.features.map((feature) => (
                        <ListItem key={feature} disableGutters>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <Box p={2}>
                    <Button
                      variant={plan.id.includes('pro') ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowUpgradeDialog(true);
                      }}
                      disabled={upgrading}
                    >
                      {upgrading ? (
                        <CircularProgress size={24} />
                      ) : plan.id === 'free' ? (
                        'Current Plan'
                      ) : (
                        'Select Plan'
                      )}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Subscription History */}
      {subscriptionHistory.length > 0 && (
        <Card>
          <CardHeader
            title="Subscription History"
            avatar={<History color="primary" />}
          />
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Plan</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Canceled</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptionHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{history.planName}</TableCell>
                      <TableCell>${history.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={history.status}
                          color={getStatusColor(history.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(history.createdAt)}</TableCell>
                      <TableCell>
                        {history.canceledAt ? formatDate(history.canceledAt) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Dialog */}
      <Dialog
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPlan ? `Upgrade to ${selectedPlan.name}` : 'Select a Plan'}
        </DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedPlan.name} - ${selectedPlan.price}/{selectedPlan.interval}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedPlan.description}
              </Typography>
              <List dense>
                {selectedPlan.features.map((feature) => (
                  <ListItem key={feature} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpgradeDialog(false)}>
            Cancel
          </Button>
          {selectedPlan && selectedPlan.id !== 'free' && (
            <Button
              variant="contained"
              onClick={() => handleUpgrade(selectedPlan)}
              disabled={upgrading}
            >
              {upgrading ? <CircularProgress size={24} /> : 'Upgrade Now'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionPage; 