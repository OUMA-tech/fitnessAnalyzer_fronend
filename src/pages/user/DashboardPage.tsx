import { useNavigate } from 'react-router-dom';
import { useWeeklyPlans, useTodayPlanFromWeekly } from '../../features/user/trainPlanAPI';
import dayjs from 'dayjs';
import { Skeleton } from '@mui/material';
import Layout from '../../components/common/Layout';
import { FaCalendarDay, FaPlus, FaHistory } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Dayjs } from 'dayjs';
import WeeklyPlans from '../../components/common/WeeklyPlans';
import NutritionOverview from '../../components/dashboard/NutritionOverview';
import { handleAxiosError } from '../../utils/handleAxiosError';
import TodaysPlan from '../../components/common/TodaysPlan';
import Grid from '@mui/material/GridLegacy';

const DashboardPage = () => {
  const navigate = useNavigate();


  const today: Dayjs = dayjs();
  
  const handleGoToPlan = () => navigate('/todayAll');
  const handleGoToEditPlan = () => navigate('/train-plan');
  const handleGoToHistory = () => navigate('/historyRecords');
  const handleGoToPlanEditor = () => navigate('/editPlan');

  const user = useSelector((state: RootState) => state.auth.user);

  const { data: weeklyPlans, isLoading: isWeeklyLoading, error } = useWeeklyPlans(today);
  const { data: todaysPlan, isLoading: isTodayLoading } = useTodayPlanFromWeekly();
  console.log(todaysPlan, isTodayLoading);
  if(error){
    handleAxiosError(error,"fetch weekly plans error")
  }

  return (
    <div className="p-6 space-y-6">
      <Layout/>
      <h1 className="text-2xl font-bold">🏋️ Welcome back, {user.username}!</h1>
      <Grid item xs={12} lg={4} mb={2}>
        <NutritionOverview />
      </Grid>

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
        <button className="flex items-center gap-4 bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
        onClick={handleGoToPlanEditor}>
          <FaCalendarDay className="text-xl" />
          <span>All Plans</span>
        </button>
      </div>
      {isWeeklyLoading ? (
        <Skeleton variant="rectangular" width="100%" height={100} />
        ):(
          <>
            <WeeklyPlans weeklyPlans={weeklyPlans} />

            {isTodayLoading ? (
              <Skeleton variant="rectangular" width="100%" height={100} />
            ):(
              <TodaysPlan todaysPlan={todaysPlan} />
          )}
          </>
        )}

    </div>
  )
};

export default DashboardPage;