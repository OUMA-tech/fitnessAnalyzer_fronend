import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Task } from '../../types/trainPLan';
import { fetchTodaysPlan } from '../../features/user/trainPlanAPI';
import dayjs from 'dayjs';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import Layout from '../../components/common/Layout';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const handleGoToPlan = () => navigate('/train-plan');
  const handleGoToHistory = () => navigate('/history');

  const [todaysPlan, setTodaysPlan] = useState<Task[]>([]);

  const today = dayjs().startOf('day').utc().toDate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cached = localStorage.getItem('todays-plan');
        if (cached) {
          const parsed = JSON.parse(cached);
          const restored = parsed.map((task: any) => ({
            ...task,
            date: new Date(task.date),
          }));
          setTodaysPlan(restored)
          return;
        }
        
        const res = await fetchTodaysPlan(today);
        const data = res.data;
        // console.log(data);
        const restored = data.map((task: any) => ({
          ...task,
          date: new Date(task.date), 
        }));
        setTodaysPlan(restored)     
        localStorage.setItem('todays-plan', JSON.stringify(restored)); 
      } catch (err) {
        console.error('Failed to fetch today\'s plan:', err);
      }
    };

    fetchData();
  }, []);
  console.log(todaysPlan);

  return (
    <div className="p-6 space-y-6">
      <Layout title='' />
      <h1 className="text-2xl font-bold">🏋️ Welcome back, Athlete!</h1>

      {/* Buttons */}
      <div className="flex space-x-4">
      <button
          onClick={handleGoToHistory}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Today's plan
        </button>
        
        <button
          onClick={handleGoToPlan}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add a new plan
        </button>
        <button
          onClick={handleGoToHistory}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          History Records
        </button>
      </div>
      { todaysPlan.length === 0 ? (
        <Typography color="textSecondary">No training plan for today.</Typography>
      ) : (
        todaysPlan.map((task) => (
          <Card key={task.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {dayjs(task.date).format('YYYY-MM-DD')}
                </Typography>
              </Box>

              {task.subTasks.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No subtasks
                </Typography>
              ) : (
                <List dense>
                  {task.subTasks.map((sub) => (
                    <ListItem key={sub.id} disablePadding>
                      <ListItemIcon>
                        <Checkbox edge="start" checked={sub.completed} disableRipple disabled />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: sub.completed ? 'line-through' : 'none',
                              color: sub.completed ? 'text.disabled' : 'text.primary',
                            }}
                          >
                            {sub.content}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )))}
      {/* Training Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <SummaryCard title="本周总距离" value="42.3 km" />
        <SummaryCard title="运动总时间" value="5h 20m" />
        <SummaryCard title="平均速度" value="7.9 km/h" />
        <SummaryCard title="训练次数" value="6 次" />
      </div>

      {/* Chart Placeholder */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">📊 近一周运动时长</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          图表（如 BarChart）可在此渲染
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white shadow p-4 rounded text-center">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);
