import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle,
  Star,
  Lock
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  title?: string;
  description?: string;
  features?: string[];
  showFeatures?: boolean;
  variant?: 'card' | 'banner' | 'inline';
  onUpgrade?: () => void;
}

const defaultFeatures = [
  'Unlimited workout tracking',
  'Advanced analytics',
  'Custom workout plans',
  'Nutrition tracking',
  'Priority support'
];

export const UpgradePrompt = ({
  title = "Upgrade to Pro",
  description = "Unlock all features and take your fitness journey to the next level",
  features = defaultFeatures,
  showFeatures = true,
  variant = 'card',
  onUpgrade
}: UpgradePromptProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/subscription');
    }
  };

  const content = (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Star color="primary" />
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
        <Chip
          label="PRO"
          color="primary"
          size="small"
          icon={<Lock />}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      {showFeatures && (
        <List dense sx={{ mb: 2 }}>
          {features.map((feature, index) => (
            <ListItem key={index} disableGutters>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpgrade}
        fullWidth={variant === 'card'}
        size={variant === 'inline' ? 'small' : 'medium'}
      >
        Upgrade Now
      </Button>
    </Box>
  );

  if (variant === 'banner') {
    return (
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        {content}
      </Box>
    );
  }

  if (variant === 'inline') {
    return (
      <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}>
        {content}
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ borderColor: 'primary.main' }}>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

// Specialized upgrade prompts for different contexts
export const WorkoutUpgradePrompt = () => (
  <UpgradePrompt
    title="Unlock Unlimited Workouts"
    description="Create unlimited custom workout routines and track your progress with advanced analytics"
    features={[
      'Unlimited workout routines',
      'Advanced progress tracking',
      'Custom exercise library',
      'Workout templates',
      'Progress analytics'
    ]}
  />
);

export const AnalyticsUpgradePrompt = () => (
  <UpgradePrompt
    title="Advanced Analytics"
    description="Get detailed insights into your fitness progress with comprehensive analytics"
    features={[
      'Detailed progress charts',
      'Performance metrics',
      'Goal tracking',
      'Trend analysis',
      'Export data'
    ]}
  />
);

export const NutritionUpgradePrompt = () => (
  <UpgradePrompt
    title="Nutrition Tracking"
    description="Track your nutrition and get personalized meal recommendations"
    features={[
      'Calorie tracking',
      'Macro breakdown',
      'Meal planning',
      'Nutrition goals',
      'Food database'
    ]}
  />
);

export const PlanUpgradePrompt = () => (
  <UpgradePrompt
    title="Custom Training Plans"
    description="Get personalized training plans tailored to your goals and fitness level"
    features={[
      'Personalized plans',
      'Goal-based training',
      'Progress adjustments',
      'Expert guidance',
      'Plan modifications'
    ]}
  />
); 