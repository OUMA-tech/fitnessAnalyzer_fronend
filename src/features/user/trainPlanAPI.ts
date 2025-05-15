import axios from 'axios';
import { Task } from '../../types/trainPLan'; 
import { store } from '../../store/store'


export const SynchronizedTrainPlan = async (tasks: Task[]) => {
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
        date: date.toISOString(), // 推荐使用 ISO 格式传递日期
      },
    }
  );
  return res.data;
}