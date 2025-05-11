import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { API_BASE_URL } from './config.ts'
import { HashRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'

console.log(API_BASE_URL)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </HashRouter>
  </StrictMode>
)
