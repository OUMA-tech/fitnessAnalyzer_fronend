// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUser } from '../slices/authSlice';
// import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
const savedAuth = localStorage.getItem('auth');
if (savedAuth) {
  store.dispatch(setUser(JSON.parse(savedAuth)));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;