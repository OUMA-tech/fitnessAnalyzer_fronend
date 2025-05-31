import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Button, 
  Box, 
  Alert,
  Collapse,
  IconButton,
  Pagination
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { fetchRecords, fetchStravaRecords } from '../../features/common/recordAPI'; // 假设封装了 axios 请求
import { Record, RecordFilters } from '../../types/record';
import Layout from '../../components/common/Layout';
import ActivityNutritionAdvice from '../../components/activity/ActivityNutritionAdvice';

const HistoryRecordsPage = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RecordFilters>({
    page: 1,
    pageSize: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRecords(filters);
      console.log('Raw records data:', res);
      setRecords(res.records);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const fetchStravaData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchStravaRecords();
      console.log('Fetched Strava records:', res);
      setRecords(res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleExpandClick = (recordId: string) => {
    console.log('Clicked record ID:', recordId);
    console.log('Current expandedId:', expandedId);
    console.log('Record IDs in list:', records.map(r => r.id));
    
    if (expandedId === recordId) {
      setExpandedId(null);
    } else {
      setExpandedId(recordId);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <>
    <Layout />
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{mt:2}}>Your Activity Records</Typography>
        <Box>
          <Button onClick={loadData} variant="outlined" sx={{ mr: 1 }}>Refresh</Button>
          <Button onClick={fetchStravaData} variant="outlined">Fetch Strava Data</Button>
        </Box>
      </Box>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && records.length === 0 && (
        <Typography>No activity data found.</Typography>
      )}

      {!loading && !error && (
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {records.map((rec, index) => {
            console.log(`Record ${index}:`, rec);
            const recordId = rec._id || rec.id;
            console.log(`Record ${index} ID:`, recordId);
            
            return (
              <Box key={recordId} p={2} border="1px solid #ccc" borderRadius={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography><strong>{rec.name || 'Unnamed Activity'}</strong></Typography>
                    <Typography>
                      {rec.type || 'Unknown'}  {
                        rec.type === 'Ride' || rec.type === 'Run'
                          ? `- ${((rec.distance || 0) / 1000).toFixed(1)} km`
                          : rec.type === 'Swim'
                          ? `- ${(rec.distance || 0).toFixed(0)} m`
                          : ''
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(rec.startDate).toLocaleString()}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => {
                      console.log('Clicking record with ID:', recordId);
                      handleExpandClick(recordId);
                    }}
                    aria-expanded={expandedId === recordId}
                    aria-label="show more"
                  >
                    {expandedId === recordId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={expandedId === recordId} timeout="auto" unmountOnExit>
                  <Box mt={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Box>
                          <Typography variant="h6" gutterBottom>Activity Details</Typography>
                          <Typography>
                            Duration: {Math.round((rec.movingTime || 0) / 60)} minutes
                          </Typography>
                          {rec.averageHeartrate && (
                            <Typography>
                              Average Heart Rate: {Math.round(rec.averageHeartrate)} bpm
                            </Typography>
                          )}
                          {rec.totalElevationGain && (
                            <Typography>
                              Elevation Gain: {rec.totalElevationGain} m
                            </Typography>
                          )}
                          {rec.calories && (
                            <Typography>
                              Calories: {rec.calories} kcal
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <ActivityNutritionAdvice activityId={recordId} />
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
          
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={filters.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      )}
    </Container>
    </>
  );
};

export default HistoryRecordsPage;