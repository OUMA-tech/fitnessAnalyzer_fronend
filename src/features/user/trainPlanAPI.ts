import axios from 'axios';
import { Plan } from '../../types/trainPLan'; 
import { store } from '../../store/store'


export const SynchronizedTrainPlan = async (tasks: Plan[]) => {
  const token = store.getState().auth.user.token;
  const res = await axios.post(
    'http://localhost:5000/api/trainPlans/', 
    { tasks },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const fetchTodaysPlan = async(date: Date) => {
  const token = store.getState().auth.user.token;
  const res = await axios.get(
    'http://localhost:5000/api/trainPlans/today', 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        date: date.toISOString(), 
      },
    }
  );
  return res.data;
}

export const updatePlan = async(plan: Plan) => {
  const token = store.getState().auth.user.token;
  const res = await axios.put(
    'http://localhost:5000/api/trainPlans/today', 
    {
      plan:plan,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}