import axios from 'axios';
import { Plan } from '../../types/trainPLan'; 
import { store } from '../../store/store'

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


