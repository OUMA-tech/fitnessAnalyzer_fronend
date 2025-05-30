import { Card, CardContent, CardHeader, Typography, Box, LinearProgress } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import PieChartIcon from '@mui/icons-material/PieChart';
import { useQuery } from '@tanstack/react-query';
import { getWeeklyNutritionSummary } from '../../services/nutritionService';
import dayjs from 'dayjs';
import Macronutrient from './Macronutrient';

const NutritionOverview = () => {
  // 获取本周的开始和结束日期
  const today = dayjs();
  const startOfWeek = today.startOf('week').toISOString();
  const endOfWeek = today.endOf('week').toISOString();

  const { data: nutritionData, isLoading } = useQuery({
    queryKey: ['weeklyNutrition', startOfWeek, endOfWeek],
    queryFn: () => getWeeklyNutritionSummary(startOfWeek, endOfWeek)
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
  console.log(nutritionData);
  const recommendation = nutritionData?.data?.recommendation;
  const summary = nutritionData?.data?.summary;

  if (!recommendation || !summary) {
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
        avatar={<PieChartIcon />}
        title="Weekly Nutrition Recommendation"
      />
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Weekly Nutrition Recommendation
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

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Hydration Suggestion
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recommendation.hydration}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Weekly Exercise Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Total Training Times: {summary.totalActivities} times
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Total Training Duration: {Math.round(summary.totalDuration)} minutes
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Average Training Intensity: {Math.round(summary.averageIntensity * 100)}%
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NutritionOverview; 