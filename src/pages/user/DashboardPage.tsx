import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Button, Box, Alert } from '@mui/material';
import { fetchRecords } from '../../features/common/recordAPI'; // 假设封装了 axios 请求

interface Record {
  id: string;
  type: string;
  distance: number;
  date: string;
}


export const DashboardPage = () => {
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

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Your Activity Records</Typography>
        <Button onClick={loadData} variant="outlined">Refresh</Button>
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
              <Typography><strong>{rec.type}</strong> - {rec.distance} meters</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(rec.date).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};
