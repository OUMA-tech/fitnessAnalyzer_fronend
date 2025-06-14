import { useSelector, useDispatch } from 'react-redux';
import { setSubscription, Subscription } from '../slices/authSlice';
import { RootState } from '../store/store';
import { request } from '../utils/request';

export const useUserSubscription = () => {
  const dispatch = useDispatch();
  const subscription = useSelector((state: RootState) => state.auth.subscription);
  const isActive = useSelector((state: RootState) => 
    state.auth.subscription?.status === 'active'
  );
  const isPro = useSelector((state: RootState) => 
    state.auth.subscription?.status === 'active' && 
    !state.auth.subscription?.cancelAtPeriodEnd
  );

  const refreshSubscription = async () => {
    try {
      const response = await request<{ subscription: Subscription }>({
        url: '/api/subscription/status',
        method: 'GET'
      });
      dispatch(setSubscription(response.subscription));
      return response.subscription;
    } catch (error) {
      console.error('Failed to refresh subscription status:', error);
      return null;
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await request<{ subscription: Subscription }>({
        url: '/api/subscription/cancel',
        method: 'POST'
      });
      dispatch(setSubscription(response.subscription));
      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  };

  const reactivateSubscription = async () => {
    try {
      const response = await request<{ subscription: Subscription }>({
        url: '/api/subscription/reactivate',
        method: 'POST'
      });
      dispatch(setSubscription(response.subscription));
      return true;
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      return false;
    }
  };

  return {
    subscription,
    isActive,
    isPro,
    refreshSubscription,
    cancelSubscription,
    reactivateSubscription
  };
}; 