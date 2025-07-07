import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AppRoutes />
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
