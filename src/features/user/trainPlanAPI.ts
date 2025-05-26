import axios from 'axios';
import { Plan } from '../../types/trainPLan'; 
import { store } from '../../store/store'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs';
import { useMemo } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const SaveTrainPlan = async (tasks: Plan[]) => {
  const token = store.getState().auth.user.token;
  const res = await axios.post(
    `${apiBaseUrl}/api/trainPlans/`, 
    { tasks },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res.data);
  return res.data;
};

export const fetchDurationPlan = async(start: string, end: string) => {
  const token = store.getState().auth.user.token;
  const res = await axios.get(
    `${apiBaseUrl}/api/trainPlans/today`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        start,
        end, 
      },
    }
  );
  return res.data.data;
}

export const updatePlan = async(plan: Plan) => {
  const token = store.getState().auth.user.token;
  const res = await axios.put(
    `${apiBaseUrl}/api/trainPlans/today`, 
    {
      plan:plan,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.success;
}

export function useMonthlyPlans(date: dayjs.Dayjs) {
  const start = date.startOf('month').toISOString();
  const end = date.endOf('month').toISOString();

  const { data, isLoading, error } = useQuery({
    queryKey: ['plans', start],
    queryFn: () => fetchDurationPlan(start, end),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });

  return { data, isLoading, error };
}

export function useWeeklyPlans(date: dayjs.Dayjs) {
  const start = date.startOf('week').toISOString();
  const end = date.endOf('week').toISOString();

  const { data, isLoading, error } = useQuery({
    queryKey: ['plans-week', start],
    queryFn: () => fetchDurationPlan(start, end),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });

  return { data, isLoading, error };
}

export function useTodayPlanFromWeekly() {
  const today = new Date();
  const todayDayjs = dayjs(today);
  const todayStr = dayjs(today).format('YYYY-MM-DD');
  const { data: weekly, isLoading } = useWeeklyPlans(todayDayjs);
  const todayData = useMemo(() => {
    if (!weekly) return null;
    return weekly.filter((plan:Plan) => dayjs(plan.date).format('YYYY-MM-DD') === todayStr) || null;
  }, [weekly, todayStr]);
  return { data: todayData, isLoading };
}

