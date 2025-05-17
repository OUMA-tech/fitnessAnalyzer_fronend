import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Button, Box, Alert } from '@mui/material';
import { fetchRecords, fetchStravaRecords } from '../../features/common/recordAPI'; // 假设封装了 axios 请求
import { Record } from '../../types/record';
import Layout from '../../components/common/Layout';

export const HistoryRecordsPage = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRecords(); // 调用 API
      setRecords(res); // 假设返回的是 { data: [...] }
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
      const res = await fetchStravaRecords(); // 调用 API
      setRecords(res); // 假设返回的是 { data: [...] }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
    <Layout title="" />
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{mt:2}}>Your Activity Records</Typography>
        <Button onClick={loadData} variant="outlined">Refresh</Button>
        <Button onClick={fetchStravaData} variant="outlined">Fetch Strava Data</Button>
      </Box>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && records.length === 0 && (
        <Typography>No activity data found.</Typography>
      )}

      {!loading && !error && (
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {records.map((rec) => (
            <Box key={rec.id} p={2} border="1px solid #ccc" borderRadius={2}>
              <Typography><strong>{rec.name}</strong></Typography>
              <Typography>
              {rec.type}  {
                rec.type === 'Ride' || rec.type === 'Run'
                  ? `- ${(rec.distance / 1000).toFixed(1)} km`
                  : rec.type === 'Swim'
                  ? `- ${rec.distance.toFixed(0)} m`
                  : ''
              }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(rec.startDate).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
    </>
  );
};
