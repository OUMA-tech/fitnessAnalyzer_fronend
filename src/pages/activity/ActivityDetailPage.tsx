import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import NutritionAdvice from '../../components/activity/ActivityNutritionAdvice';
import Layout from '../../components/common/Layout';

const ActivityDetailPage = () => {
  const { activityId } = useParams<{ activityId: string }>();

  if (!activityId) {
    return <Typography>Activity not found</Typography>;
  }

  return (
    <div className="p-6">
      <Layout />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Activity Details
              </Typography>
              {/* TODO: Add activity details component */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <NutritionAdvice activityId={activityId} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ActivityDetailPage; 