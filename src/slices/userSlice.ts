// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  email: string;
  token: string;
}

const initialState: UserState = {
  username: '',
  email: '',
  token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    clearUser(state) {
      state.username = '';
      state.email = '';
      state.token = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
