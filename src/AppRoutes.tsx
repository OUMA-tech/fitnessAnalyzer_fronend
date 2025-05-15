
import { Route, Routes } from 'react-router-dom'

import { LoginPage } from './pages/common/LoginPage'
import { RegisterPage } from './pages/common/RegisterPage'
import WelcomePage from './pages/common/WelcomePage'
import ShopPage from './pages/user/shop/ShopPage'
import { DashboardPage } from './pages/user/DashboardPage'
import { HistoryRecordsPage } from './pages/user/HistoryRecords'
import TrainingPlanPage from './pages/user/TrainningPlanPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AppRoutes() {
  return (
    <>
    <Routes>
      <Route path="/" element={<WelcomePage />}/>
      <Route path="/shop" element={<ShopPage />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/historyRecords' element={<HistoryRecordsPage />} />
      <Route path='/train-plan' element={<TrainingPlanPage />} />
    </Routes>
    <ToastContainer position="top-center" autoClose={2000} />
    </>
  )
}

export default AppRoutes