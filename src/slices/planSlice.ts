// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Plan, SubTask } from '../types/trainPLan';

interface PlanState {
  todayplans: PlanForRedux[];
}

export interface PlanForRedux {
  id: number;
  title: string;
  date: string;
  status: 'draft' | 'planned' | 'completed';
  subTasks: SubTask[];
}

const initialState: PlanState = {
  todayplans: [],
};

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<PlanForRedux[]>) => {
      state.todayplans = action.payload;
    },
    clearPlans: (state) => {
      state.todayplans = [];
    },
  },
});

export const { setPlans, clearPlans } = planSlice.actions;
export default planSlice.reducer;
