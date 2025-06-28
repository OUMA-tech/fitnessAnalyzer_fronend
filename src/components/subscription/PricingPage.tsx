import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import { CheckCircle, ExpandMore, QuestionAnswer } from '@mui/icons-material';
import { request } from '../../utils/request';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  priceId: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    priceId: '',
    description: 'Perfect for trying out our features',
    features: [
      'Basic workout tracking',
      'Limited exercise library',
      'Basic progress charts',
      '3 workout routines',
      'Community access'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    priceId: process.env.REACT_APP_STRIPE_PRO_PRICE_ID || '',
    description: 'For serious fitness enthusiasts',
    features: [
      'Unlimited workout tracking',
      'Full exercise library',
      'Advanced analytics',
      'Unlimited routines',
      'Priority support',
      'Custom workout plans',
      'Nutrition tracking',
      'Body metrics analysis'
    ]
  }
];

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to Pro features until the end of your billing period.'
  },
  {
    question: 'What happens after my free trial?',
    answer: 'After your free trial ends, you can choose to upgrade to our Pro plan to continue enjoying all features. If you don\'t upgrade, your account will automatically switch to the Free plan.'
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes, all payments are processed securely through Stripe. We never store your credit card information directly.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with our Pro features, contact our support team for a full refund.'
  }
];

export const PricingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: Plan) => {
    if (plan.id === 'free') {
      // Handle free trial signup
      // TODO: Implement free trial signup logic
      return;
    }

    try {
      setLoading(true);
      const response = await request<{ sessionUrl: string }>({
        url: '/api/stripe/create-checkout-session',
        method: 'POST',
        data: { priceId: plan.priceId }
      });

      window.location.href = response.sessionUrl;
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="sm" mx="auto">
          Start with a 14-day free trial. No credit card required.
          Upgrade, downgrade, or cancel anytime.
        </Typography>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={4}
        mb={8}
      >
        {plans.map((plan) => (
          <Card
            key={plan.id}
            sx={{
              width: 350,
              transform: plan.id === 'pro' ? 'scale(1.05)' : 'none',
              border: plan.id === 'pro' ? 2 : 1,
              borderColor: plan.id === 'pro' ? 'primary.main' : 'divider',
              borderRadius: 2,
            }}
          >
            <CardHeader
              title={
                <Box textAlign="center">
                  <Typography variant="h5" component="div">
                    {plan.name}
                  </Typography>
                  {plan.id === 'pro' && (
                    <Chip
                      label="RECOMMENDED"
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              }
            />
            <CardContent>
              <Box textAlign="center" mb={3}>
                <Typography variant="h3" component="div" gutterBottom>
                  ${plan.price}
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    /month
                  </Typography>
                </Typography>
                <Typography color="text.secondary">
                  {plan.description}
                </Typography>
              </Box>

              <List disablePadding>
                {plan.features.map((feature) => (
                  <ListItem key={feature} disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>

              <Button
                variant={plan.id === 'pro' ? 'contained' : 'outlined'}
                size="large"
                fullWidth
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : plan.id === 'free' ? (
                  'Start Free Trial'
                ) : (
                  'Get Started'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box maxWidth="md" mx="auto">
        <Typography variant="h4" component="h2" textAlign="center" mb={4}>
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <QuestionAnswer color="primary" />
                <Typography variant="subtitle1">{faq.question}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}; 