import axios from "axios";
import { Record } from '../../types/record';
import { store } from '../../store/store'

const API_URL = 'http://localhost:5000/api/records';
const StravaData_URL = 'https://fitnessanalyzer-backend.onrender.com/api/strava/records'



export const fetchRecords = async (): Promise<Record[]> => {
  const token = store.getState().auth.user.token;
  if (!token) {
    throw new Error('Missing user token');
  }
  const res = await axios.get(API_URL, {
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
