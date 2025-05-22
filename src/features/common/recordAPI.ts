import axios from "axios";
import { Record } from '../../types/record';
import { store } from '../../store/store'

const API_URL = 'https://fitnessanalyzer-backend.onrender.com/api/records';
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
  console.log(res.data);
  return res.data.records;
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
  console.log(res.data);
  return res.data.records;
}
