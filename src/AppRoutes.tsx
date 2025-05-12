
import { Route, Routes } from 'react-router-dom'

import { LoginPage } from './pages/common/LoginPage'
import { RegisterPage } from './pages/common/RegisterPage'
import WelcomePage from './pages/common/WelcomePage'
import ShopPage from './pages/user/shop/ShopPage'
import { DashboardPage } from './pages/user/DashboardPage'



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />}/>
      <Route path="/shop" element={<ShopPage />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
      <Route path='/dashboard' element={<DashboardPage />} />
    </Routes>
  )
}

export default AppRoutes