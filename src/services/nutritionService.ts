import { request } from '../utils/request';

export interface NutritionRecommendation {
  carbs: {
    percentage: number;
    explanation: string;
  };
  protein: {
    percentage: number;
    explanation: string;
  };
  fats: {
    percentage: number;
    explanation: string;
  };
  timing: string;
  hydration: string;
}

export interface NutritionSummary {
  totalActivities: number;
  totalDuration: number;
  averageIntensity: number;
}

export interface NutritionResponse {
  success: boolean;
  data: {
    recommendation: NutritionRecommendation;
    summary: NutritionSummary;
  };
}

export const getWeeklyNutritionSummary = (startDate: string, endDate: string) => {
  return request<NutritionResponse>({
    url: '/api/nutrition/weekly',
    method: 'GET',
    params: {
      start: startDate,
      end: endDate
    }
  });
};

export const getActivityNutritionAdvice = (activityId: string) => {
  return request<NutritionResponse>({
    url: `/api/nutrition/activity/${activityId}`,
    method: 'GET'
  });
}; 