export type SubscriptionCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELED';

export interface SubscriptionPlan {
  id: SubscriptionCycle;
  name: string;
  cycle: SubscriptionCycle;
  priceInr: number;
  priceUsd: number;
  savingsLabel?: string;
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscriptionState {
  planId: SubscriptionCycle;
  planName: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  startDate: string;
  endDate: string;
  amountPaid: number;
  referralCode: string;
  referralsCount: number;
  creditsEarnedInr: number;
  appliedCoupon?: string;
  discountPercent?: number;
}

export interface Invoice {
  id: string;
  date: string;
  planName: string;
  amount: number;
  tax: number;
  total: number;
  status: 'PAID' | 'REFUNDED';
  downloadUrl?: string;
}

export interface CouponCode {
  code: string;
  discountPercent: number;
  description: string;
}
