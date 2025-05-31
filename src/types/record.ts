// types.ts
export interface Record {
  _id?: string;  // MongoDB ID
  id: string;    // Regular ID
  name: string;
  type: string;
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
  category?: string;
}

