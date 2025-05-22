// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubTask } from '../types/trainPLan';

interface PlanState {
  weeklyplans: PlanForRedux[];
}

export interface PlanForRedux {
  id: number;
  title: string;
  date: string;
  status: 'draft' | 'planned' | 'completed';
  subTasks: SubTask[];
}

const initialState: PlanState = {
  weeklyplans: [],
};

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setWeeklyPlans: (state, action: PayloadAction<PlanForRedux[]>) => {
      state.weeklyplans = action.payload;
    },
    clearWeeklyPlans: (state) => {
      state.weeklyplans = [];
    },
  },
});

export const { setWeeklyPlans, clearWeeklyPlans } = planSlice.actions;
export default planSlice.reducer;
