// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired';
  planId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}
interface AuthState {
  user: {
    id: string | null;
    username: string | null;
    avatar: string | null;
    token: string | null;
    role: string | null;
  };
  subscription: Subscription | null;
  isAuthenticated: boolean;  
}

const initialState: AuthState = {
  user: {
    id: null,
    username: null,
    avatar: null,
    token: null,
    role: null,
  },
  subscription: null,
  isAuthenticated: false,  // default unlogin
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; username: string; token: string; role: string; avatar: string }>) => {
      state.user = action.payload;
      state.isAuthenticated = true; 
    },
    setSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.subscription = action.payload;
    },
    clearUser: (state) => {
      state.user = { id: null, username: null, token: null, role: null, avatar:null };
      state.isAuthenticated = false;  
      state.subscription = null;
    },
  },
});

export const { setUser, setSubscription, clearUser } = authSlice.actions;
export default authSlice.reducer;
