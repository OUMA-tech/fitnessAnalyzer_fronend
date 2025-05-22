
import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react';

import WelcomePage from './pages/common/WelcomePage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = lazy(()=>import('./pages/common/LoginPage'));
const RegisterPage = lazy(()=>import('./pages/common/RegisterPage'));
const DashboardPage = lazy(()=>import('./pages/user/DashboardPage'));
const HistoryRecordsPage = lazy(()=>import('./pages/user/HistoryRecords'));
const TrainingPlanPage = lazy(()=>import('./pages/user/TrainningPlanPage'));
const TodayAllPage = lazy(()=>import('./pages/user/TodatAllPage'));
const ProfilePage = lazy(()=>import('./pages/user/ProfilePage'));

function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<WelcomePage />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/historyRecords' element={<HistoryRecordsPage />} />
      <Route path='/train-plan' element={<TrainingPlanPage />} />
      <Route path='/todayAll' element={<TodayAllPage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </Suspense>
  )
}

export default AppRoutes