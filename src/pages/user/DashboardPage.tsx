import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Plan } from '../../types/trainPLan';
import { fetchDurationPlan } from '../../features/user/trainPlanAPI';
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
  Alert,
  Paper,
  Divider,
  Button
} from '@mui/material';
import Layout from '../../components/common/Layout';
import { FaCalendarDay, FaPlus, FaHistory } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useDispatch } from 'react-redux';
import { setWeeklyPlans } from '../../slices/planSlice';
import { Dayjs } from 'dayjs';
import WeeklyPlans from '../../components/common/WeeklyPlans';
import WeeklySummary from '../../components/common/WeeklySummary';
import { handleAxiosError } from '../../utils/handleAxiosError';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [todaysPlan, setTodaysPlan] = useState<Plan[]>([]);
  const [thisWeekPlan, setThisWeekPlan] = useState<Plan[]>([]);
  const today: Dayjs = dayjs();
  const planFromRedux = useSelector((state: RootState) => state.plans.weeklyplans);
  
  const handleGoToPlan = () => navigate('/todayAll');
  const handleGoToEditPlan = () => navigate('/train-plan');
  const handleGoToHistory = () => navigate('/historyRecords');

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {

    const fetchThisWeekPlan = async() => {
      try{
        if (planFromRedux && planFromRedux.length > 0) {
          console.log("fetching from redux.......");
          const strToday = planFromRedux.filter((task) => dayjs(task.date).isSame(dayjs(), 'day'));
          const weeklyplans = planFromRedux.map(plan => ({
            ...plan,
            date: new Date(plan.date),
          }));
          setThisWeekPlan(weeklyplans); 
          const todayPlans = strToday.map(plan => ({
            ...plan,
            date: new Date(plan.date),
          }));
          setTodaysPlan(todayPlans);
         } else{
          console.log("fetching from database.......");
          const start = dayjs(today).startOf('week').toISOString();
          const end = dayjs(today).endOf('week').toISOString();
          const res = await fetchDurationPlan(start, end);
          const data = res.data;
          console.log(data);
          dispatch(setWeeklyPlans(data));
          const weeklyplans = data.map((plan:Plan) => ({
            ...plan,
            date: new Date(plan.date),
          }));
          setThisWeekPlan(weeklyplans); 
          const strToday = data.filter((plan:Plan) =>
            dayjs(plan.date).isSame(dayjs(), 'day')
          );
          const todayPlans = strToday.map((plan:Plan) => ({
            ...plan,
            date: new Date(plan.date),
          }));
          console.log(todaysPlan);
          setTodaysPlan(todayPlans);
         }
          
      } catch (err) {
        console.error('Failed to fetch today\'s plan:', err);
        handleAxiosError(err, 'Failed to update plan');
      }
    }
    fetchThisWeekPlan();
  }, []);
  
  
  console.log(todaysPlan);


  return (
    <div className="p-6 space-y-6">
      <Layout/>
      <h1 className="text-2xl font-bold">🏋️ Welcome back, {user.username}!</h1>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center">
      <button className="flex items-center gap-4 bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
      onClick={handleGoToPlan}>
        <FaCalendarDay className="text-xl" />
        <span>Today's Plan</span>
      </button>

      <button
        onClick={handleGoToEditPlan}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        <FaPlus />
        Add New Plan
      </button>

      <button
        onClick={handleGoToHistory}
        className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700 transition"
      >
        <FaHistory />
        History Records
      </button>
    </div>
    <Box padding={1}>
    <WeeklySummary weeklyplans={thisWeekPlan} />
    </Box>
    <Box padding={1}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🗓️ Plan This Week
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <WeeklyPlans thisWeekPlan={thisWeekPlan} />
      </Paper>
    </Box>
      { todaysPlan.length === 0 ? (
          <Alert severity="info" sx={{ mt: 4, borderRadius: 2 }}>
          <Typography variant="h6" textAlign="center">
            No training plan for today.
          </Typography>
        </Alert>
      ) : (
        todaysPlan.slice(0, 3).map((task) => (
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
        {todaysPlan.length > 3 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/todayAll', { state: { todaysPlan } })} 
            >
              View all ({todaysPlan.length})
            </Button>
          </Box>
        )}
        

      {/* Training Summary */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <SummaryCard title="本周总距离" value="42.3 km" />
        <SummaryCard title="运动总时间" value="5h 20m" />
        <SummaryCard title="平均速度" value="7.9 km/h" />
        <SummaryCard title="训练次数" value="6 次" />
      </div> */}

      {/* Chart Placeholder */}
      {/* <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">📊 近一周运动时长</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          图表（如 BarChart）可在此渲染
        </div>
      </div> */}
    </div>
  );
};

// const SummaryCard = ({ title, value }: { title: string; value: string }) => (
//   <div className="bg-white shadow p-4 rounded text-center">
//     <div className="text-sm text-gray-500">{title}</div>
//     <div className="text-xl font-bold">{value}</div>
//   </div>
// );

export default DashboardPage;