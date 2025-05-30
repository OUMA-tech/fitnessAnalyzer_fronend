import { Card, CardContent, CardHeader, Typography, Box, LinearProgress } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useQuery } from '@tanstack/react-query';
import { getActivityNutritionAdvice } from '../../services/nutritionService';
import Macronutrient from '../dashboard/Macronutrient';




interface NutritionAdviceProps {
  activityId: string;
}

const NutritionAdvice = ({ activityId }: NutritionAdviceProps) => {
  const { data: nutritionData, isLoading } = useQuery({
    queryKey: ['activityNutrition', activityId],
    queryFn: () => getActivityNutritionAdvice(activityId),
    enabled: Boolean(activityId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  const recommendation = nutritionData?.data?.recommendation;

  if (!recommendation) {
    return (
      <Card>
        <CardContent>
          <Typography>No data</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        avatar={<RestaurantIcon />}
        title="Nutrition Supplement Suggestion"
      />
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recommended Macronutrient Ratio
          </Typography>
          <Macronutrient
            title="Carbohydrates"
            percentage={recommendation.carbs.percentage}
            color="#2196f3"
            explanation={recommendation.carbs.explanation}
          />
          <Macronutrient
            title="Protein"
            percentage={recommendation.protein.percentage}
            color="#4caf50"
            explanation={recommendation.protein.explanation}
          />
          <Macronutrient
            title="Fats"
            percentage={recommendation.fats.percentage}
            color="#ff9800"
            explanation={recommendation.fats.explanation}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Supplement Suggestion
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recommendation.timing}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Hydration Suggestion
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recommendation.hydration}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NutritionAdvice; 