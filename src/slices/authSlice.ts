// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    id: string | null;
    username: string | null;
    token: string | null;
    role: string | null;
  };
  isAuthenticated: boolean;  
}

const initialState: AuthState = {
  user: {
    id: null,
    username: null,
    token: null,
    role: null,
  },
  isAuthenticated: false,  // default unlogin
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; username: string; token: string; role: string }>) => {
      state.user = action.payload;
      state.isAuthenticated = true; 
    },
    clearUser: (state) => {
      state.user = { id: null, username: null, token: null, role: null };
      state.isAuthenticated = false;  
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
