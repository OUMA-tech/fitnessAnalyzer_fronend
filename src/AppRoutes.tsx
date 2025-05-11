
import { Route, Routes } from 'react-router-dom'
import Home from './components/common/Home'
import Shop from './components/common/Shop'

import { LoginPage } from './pages/common/LoginPage'
import { RegisterPage } from './pages/common/RegisterPage'



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/shop" element={<Shop />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
    </Routes>
  )
}

export default AppRoutes