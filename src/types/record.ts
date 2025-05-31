// types.ts
export enum ActivityType {
  ALL = '',
  RUN = 'Run',
  RIDE = 'Ride',
  SWIM = 'Swim',
  WALK = 'Walk',
  HIKE = 'Hike',
  WORKOUT = 'WeightTraining'
}

export interface Record {
  _id?: string;  // MongoDB ID
  id: string;    // Regular ID
  name: string;
  type: ActivityType;  // 使用枚举类型
  distance: number;
  startDate: string;
  movingTime: number;
  averageHeartrate?: number;
  totalElevationGain?: number;
  calories?: number;
}

export interface PaginatedResponse {
  records: Record[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RecordFilters {
  page?: number;
  pageSize?: number;
  category?: ActivityType;  // 使用枚举类型
}