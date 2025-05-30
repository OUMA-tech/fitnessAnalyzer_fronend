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

