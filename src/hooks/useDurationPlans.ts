import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { fetchDurationPlan } from '../services/trainPlanAPI';
import { Plan } from '../types/trainPLan';

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