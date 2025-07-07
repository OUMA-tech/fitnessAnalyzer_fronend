import axios from "axios";
import { Record, PaginatedResponse, RecordFilters } from '../types/record';
import { store } from '../store/store'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${apiBaseUrl}/api/records`;
const StravaData_URL = `${apiBaseUrl}/api/strava/records`;

export const fetchRecords = async (filters: RecordFilters = {}): Promise<PaginatedResponse> => {
  const token = store.getState().auth.user.token;
  if (!token) {
    throw new Error('Missing user token');
  }

  const { page = 1, pageSize = 10, category } = filters;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(category && { category })
  });

  const res = await axios.get(`${API_URL}?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  const { records, total } = res.data;
  if (!Array.isArray(records)) {
    console.error('Unexpected response format:', res.data);
    throw new Error('Invalid response format');
  }

  // Map the records to ensure correct ID fields
  const mappedRecords = records.map((record: any) => ({
    ...record,
    _id: record._id || undefined,
    id: record.id || record._id || String(Math.random()),
    name: record.name || 'Unnamed Activity',
    type: record.type || 'Unknown',
    distance: record.distance || 0,
    startDate: record.startDate || new Date().toISOString(),
    movingTime: record.movingTime || 0,
  }));

  return {
    records: mappedRecords,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

export const fetchStravaRecords = async (): Promise<Record[]> => {
  const token = store.getState().auth.user.token;
  if (!token) {
    throw new Error('Missing user token');
  }
  const res = await axios.get(StravaData_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  // Ensure we're getting the correct data structure
  const records = res.data.records || res.data;
  if (!Array.isArray(records)) {
    console.error('Unexpected response format:', res.data);
    throw new Error('Invalid response format');
  }

  // Map the records to ensure correct ID fields
  return records.map((record: any) => {
    // Keep both _id and id fields if they exist
    const mappedRecord = {
      ...record,
      _id: record._id || undefined,
      id: record.id || record._id || String(Math.random()), // Fallback to random ID if neither exists
      name: record.name || 'Unnamed Activity',
      type: record.type || 'Unknown',
      distance: record.distance || 0,
      startDate: record.startDate || new Date().toISOString(),
      movingTime: record.movingTime || 0,
    };
    console.log('Mapped record:', mappedRecord);
    return mappedRecord;
  });
}
