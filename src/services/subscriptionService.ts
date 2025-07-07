import { request } from '../utils/request';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  interval: 'month' | 'year';
}

export interface CurrentSubscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  planName: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
}

export interface SubscriptionHistory {
  id: string;
  planName: string;
  amount: number;
  status: string;
  createdAt: string;
  canceledAt?: string;
}

export interface CreateSubscriptionRequest {
  priceId: string;
}

export interface CreateSubscriptionResponse {
  sessionUrl: string;
}

export interface UpdateSubscriptionRequest {
  isPro: boolean;
}

export class SubscriptionService {
  /**
   * Get current user subscription
   */
  static async getCurrentSubscription(): Promise<CurrentSubscription | null> {
    try {
      const response = await request<CurrentSubscription>({
        url: '/api/subscription',
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      return null;
    }
  }

  /**
   * Get subscription history
   */
  static async getSubscriptionHistory(): Promise<SubscriptionHistory[]> {
    try {
      const response = await request<SubscriptionHistory[]>({
        url: '/api/subscription/history',
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      return [];
    }
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(data: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
    const response = await request<CreateSubscriptionResponse>({
      url: '/api/subscription/create',
      method: 'POST',
      data
    });
    return response;
  }

  /**
   * Verify subscription after successful payment
   */
  static async verifySubscription(sessionId: string): Promise<any> {
    const response = await request<any>({
      url: '/api/subscription/verify',
      method: 'POST',
      data: { sessionId }
    });
    return response;
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  static async updateSubscription(data: UpdateSubscriptionRequest): Promise<any> {
    const response = await request({
      url: '/api/subscription/update',
      method: 'PUT',
      data
    });
    return response;
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await request({
        url: `/api/subscription/${subscriptionId}/cancel`,
        method: 'POST'
      });
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  /**
   * Get available subscription plans
   */
  static async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await request<SubscriptionPlan[]>({
        url: '/api/subscription/plans',
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching available plans:', error);
      // Return default plans if API fails
      return [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          priceId: '',
          description: 'Basic features for getting started',
          features: [
            'Basic workout tracking',
            'Limited exercise library',
            'Basic progress charts',
            '3 workout routines',
            'Community access'
          ],
          interval: 'month'
        },
        {
          id: 'pro-monthly',
          name: 'Pro Monthly',
          price: 9.99,
          priceId: process.env.REACT_APP_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_monthly',
          description: 'Full access to all features',
          features: [
            'Unlimited workout tracking',
            'Full exercise library',
            'Advanced analytics',
            'Unlimited routines',
            'Priority support',
            'Custom workout plans',
            'Nutrition tracking',
            'Body metrics analysis',
            'Personal trainer AI'
          ],
          interval: 'month'
        },
        {
          id: 'pro-yearly',
          name: 'Pro Yearly',
          price: 99.99,
          priceId: process.env.REACT_APP_STRIPE_PRO_YEARLY_PRICE_ID || 'price_yearly',
          description: 'Best value with 2 months free',
          features: [
            'All Pro Monthly features',
            '2 months free',
            'Early access to new features',
            'Exclusive content'
          ],
          interval: 'year'
        }
      ];
    }
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription(): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription();
      return subscription?.status === 'active';
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  /**
   * Get subscription status for feature access
   */
  static async getSubscriptionStatus(): Promise<{
    isActive: boolean;
    planName: string;
    canAccessProFeatures: boolean;
  }> {
    try {
      const subscription = await this.getCurrentSubscription();
      return {
        isActive: subscription?.status === 'active',
        planName: subscription?.planName || 'Free',
        canAccessProFeatures: subscription?.status === 'active'
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return {
        isActive: false,
        planName: 'Free',
        canAccessProFeatures: false
      };
    }
  }
} 