import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HashRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'

console.log('ALL ENV:', import.meta.env);
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
console.log('MODE:', import.meta.env.MODE);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </HashRouter>
  </StrictMode>
)
