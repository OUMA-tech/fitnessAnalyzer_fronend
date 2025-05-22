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
  console.log(res.data);
  return res.data;
};

export const fetchDurationPlan = async(start: string, end: string) => {
  const token = store.getState().auth.user.token;
  const res = await axios.get(
    'http://localhost:5000/api/trainPlans/today', 
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