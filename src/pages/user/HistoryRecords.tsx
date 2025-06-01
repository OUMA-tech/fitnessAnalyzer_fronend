import { useState, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Button, 
  Box, 
  Alert,
  Collapse,
  IconButton,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { fetchRecords, fetchStravaRecords } from '../../features/common/recordAPI';
import { Record, ActivityType } from '../../types/record';
import Layout from '../../components/common/Layout';
import ActivityNutritionAdvice from '../../components/activity/ActivityNutritionAdvice';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 10;

const HistoryRecordsPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<ActivityType>(ActivityType.ALL);
  const queryClient = useQueryClient();

  // 使用 React Query 获取数据
  const { data: allRecords = [], isLoading, error: queryError } = useQuery({
    queryKey: ['records'],
    queryFn: async () => {
      const response = await fetchRecords({ page: 1, pageSize: 1000 }); // 获取所有记录
      return response.records;
    }
  });

  // 使用 useMemo 进行本地筛选和分页
  const { filteredRecords, totalPages } = useMemo(() => {
    console.log('allRecords', allRecords);
    console.log('selectedType', selectedType);
    // 先按类型筛选
    const filtered = selectedType === ActivityType.ALL
      ? allRecords
      : allRecords.filter(record => record.type === selectedType);

    // 计算总页数
    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    // 分页
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedRecords = filtered.slice(start, start + ITEMS_PER_PAGE);

    return {
      filteredRecords: paginatedRecords,
      totalPages: total
    };
  }, [allRecords, selectedType, currentPage]);


  const handleExpandClick = (recordId: string) => {
    setExpandedId(expandedId === recordId ? null : recordId);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
    setCurrentPage(1); // 重置到第一页
  };

  return (
    <>
    <Layout />
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{mt:2}}>Your Activity Records</Typography>
        <Box>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['records'] })} 
            variant="outlined" 
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel id="activity-type-label">Activity Type</InputLabel>
          <Select
            labelId="activity-type-label"
            value={selectedType}
            onChange={handleTypeChange}
            label="Activity Type"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={ActivityType.ALL}>
              <em>All Activities</em>
            </MenuItem>
            {Object.values(ActivityType).map((type) => (
              type !== ActivityType.ALL && (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              )
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading && <CircularProgress />}

      {queryError && (
        <Alert severity="error">
          {queryError instanceof Error ? queryError.message : 'Failed to fetch records'}
        </Alert>
      )}

      {!isLoading && !queryError && filteredRecords.length === 0 && (
        <Typography>No activity data found.</Typography>
      )}

      {!isLoading && !queryError && (
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {filteredRecords.map((rec) => (
            <Box key={rec.id} p={2} border="1px solid #ccc" borderRadius={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography><strong>{rec.name}</strong></Typography>
                  <Typography>
                    {rec.type}  {
                      rec.type === ActivityType.RIDE || rec.type === ActivityType.RUN
                        ? `- ${(rec.distance / 1000).toFixed(1)} km`
                        : rec.type === ActivityType.SWIM
                        ? `- ${rec.distance.toFixed(0)} m`
                        : ''
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(rec.startDate).toLocaleString()}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleExpandClick(rec.id)}
                  aria-expanded={expandedId === rec.id}
                  aria-label="show more"
                >
                  {expandedId === rec.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedId === rec.id} timeout="auto" unmountOnExit>
                <Box display="flex" flexDirection="column" mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Box>
                        <Typography variant="h6" gutterBottom>Activity Details</Typography>
                        <Typography>
                          Duration: {Math.round(rec.movingTime / 60)} minutes
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
                      <ActivityNutritionAdvice activityId={rec.id} />
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Box>
          ))}
          
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
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