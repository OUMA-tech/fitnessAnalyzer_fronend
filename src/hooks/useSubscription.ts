import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SubscriptionService, CurrentSubscription } from '../services/subscriptionService';
import { RootState } from '../store/store';

interface SubscriptionStatus {
  isActive: boolean;
  planName: string;
  canAccessProFeatures: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseSubscriptionReturn {
  subscription: CurrentSubscription | null;
  status: SubscriptionStatus;
  refresh: () => Promise<void>;
  hasActiveSubscription: () => boolean;
}

// Global state to prevent multiple API calls
let globalSubscriptionState: {
  subscription: CurrentSubscription | null;
  isLoading: boolean;
  error: string | null;
  promise: Promise<CurrentSubscription | null> | null;
} = {
  subscription: null,
  isLoading: false,
  error: null,
  promise: null
};

export const useSubscription = (): UseSubscriptionReturn => {
  // First check Redux state
  const reduxSubscription = useSelector((state: RootState) => state.auth.subscription);
  
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    // If there's already a pending request, wait for it
    if (globalSubscriptionState.promise) {
      try {
        const data = await globalSubscriptionState.promise;
        setSubscription(data);
        setIsLoading(false);
        return;
      } catch (err) {
        setError('Failed to load subscription information');
        setIsLoading(false);
        return;
      }
    }

    // If we already have data, use it
    if (globalSubscriptionState.subscription) {
      setSubscription(globalSubscriptionState.subscription);
      setIsLoading(false);
      return;
    }

    // Start new request
    globalSubscriptionState.isLoading = true;
    globalSubscriptionState.promise = SubscriptionService.getCurrentSubscription();

    try {
      const data = await globalSubscriptionState.promise;
      globalSubscriptionState.subscription = data;
      globalSubscriptionState.isLoading = false;
      globalSubscriptionState.promise = null;
      setSubscription(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      globalSubscriptionState.error = 'Failed to load subscription information';
      globalSubscriptionState.isLoading = false;
      globalSubscriptionState.promise = null;
      setError('Failed to load subscription information');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If Redux has subscription data, use it immediately
    if (reduxSubscription) {
      const mapStatus = (status: string): 'active' | 'canceled' | 'past_due' | 'incomplete' => {
        switch (status) {
          case 'active':
            return 'active';
          case 'canceled':
            return 'canceled';
          case 'past_due':
            return 'past_due';
          case 'incomplete':
          case 'incomplete_expired':
            return 'incomplete';
          default:
            return 'incomplete';
        }
      };

      const mappedSubscription = {
        id: reduxSubscription.id,
        stripeSubscriptionId: reduxSubscription.id,
        planName: reduxSubscription.planId === 'pro' ? 'Pro Plan' : 'Free Plan',
        status: mapStatus(reduxSubscription.status),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: reduxSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: reduxSubscription.cancelAtPeriodEnd
      };

      // Update global state
      globalSubscriptionState.subscription = mappedSubscription;
      setSubscription(mappedSubscription);
      setIsLoading(false);
    } else {
      // Only fetch from API if Redux doesn't have data
      fetchSubscription();
    }
  }, [reduxSubscription, fetchSubscription]);

  const refresh = useCallback(async () => {
    // Clear global state and fetch fresh data
    globalSubscriptionState.subscription = null;
    globalSubscriptionState.promise = null;
    await fetchSubscription();
  }, [fetchSubscription]);

  const hasActiveSubscription = useCallback(() => {
    return subscription?.status === 'active';
  }, [subscription]);

  const status: SubscriptionStatus = {
    isActive: subscription?.status === 'active' || false,
    planName: subscription?.planName || 'Free',
    canAccessProFeatures: subscription?.status === 'active' || false,
    isLoading,
    error
  };

  return {
    subscription,
    status,
    refresh,
    hasActiveSubscription
  };
};

// Hook for checking if user can access pro features
export const useProAccess = () => {
  const { status } = useSubscription();
  
  return {
    canAccessPro: status.canAccessProFeatures,
    isLoading: status.isLoading,
    planName: status.planName
  };
};

// Hook for subscription status only (lighter version)
export const useSubscriptionStatus = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isActive: false,
    planName: 'Free',
    canAccessProFeatures: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const subscriptionStatus = await SubscriptionService.getSubscriptionStatus();
        setStatus({
          ...subscriptionStatus,
          isLoading: false,
          error: null
        });
      } catch (err) {
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load subscription status'
        }));
      }
    };

    fetchStatus();
  }, []);

  return status;
}; 