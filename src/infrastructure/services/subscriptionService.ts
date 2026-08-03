import {
  SubscriptionPlan,
  UserSubscriptionState,
  Invoice,
  CouponCode,
  SubscriptionCycle,
} from '../../domain/entities/Subscription';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly Basket',
    cycle: 'weekly',
    priceInr: 999,
    priceUsd: 12,
    features: [
      '1 Organic Farm Produce Basket / Week',
      'Basic Calorie & Water Tracker',
      'Community Recipe Access',
      'Standard Delivery Slot',
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly Health+',
    cycle: 'monthly',
    priceInr: 3499,
    priceUsd: 39,
    isPopular: true,
    savingsLabel: 'Save 12%',
    features: [
      '4 Farm-to-Table Organic Baskets / Month',
      'Unlimited 24/7 Gemini AI Nutrition Advisor',
      'Personalized Indian Meal Planner',
      'Vitals & Weight Analytics Dashboard',
      'Free Home Delivery',
    ],
  },
  {
    id: 'quarterly',
    name: 'Quarterly Pro',
    cycle: 'quarterly',
    priceInr: 8999,
    priceUsd: 99,
    savingsLabel: 'Save 18%',
    features: [
      '12 Organic Farm Produce Baskets',
      'Priority AI Advice & Diet Optimization',
      'Custom Seasonal Harvest Selection',
      'Quarterly Nutritionist Review',
      '24/7 Priority Support',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly VIP',
    cycle: 'yearly',
    priceInr: 29999,
    priceUsd: 349,
    savingsLabel: 'Save 30%',
    features: [
      '52 Weekly Heritage Produce Baskets',
      'VIP Dedicated Clinical Nutritionist',
      'Free Annual Farm Visit & Organic Cooking Workshop',
      'Unlimited AI Advisor & Custom Recipes',
      'Free Express Delivery & Zero Tax',
    ],
  },
];

export const VALID_COUPONS: CouponCode[] = [
  { code: 'HEALTHPLUS20', discountPercent: 20, description: '20% OFF on all plans' },
  { code: 'FARM100', discountPercent: 15, description: '15% Extra Savings on Farm Baskets' },
  { code: 'VIP50', discountPercent: 50, description: '50% Mega Discount for VIP Annual Members' },
];

const STORAGE_STATE_KEY = 'kshetriva_subscription_state';
const STORAGE_INVOICES_KEY = 'kshetriva_subscription_invoices';

class SubscriptionService {
  private getInitialState(): UserSubscriptionState {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    return {
      planId: 'monthly',
      planName: 'Monthly Health+',
      status: 'ACTIVE',
      autoRenew: true,
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0],
      amountPaid: 3499,
      referralCode: 'REF-KSHETRIVA-8823',
      referralsCount: 4,
      creditsEarnedInr: 2000,
    };
  }

  private getInitialInvoices(): Invoice[] {
    return [
      {
        id: 'INV-2026-003',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        planName: 'Monthly Health+',
        amount: 3499,
        tax: 175,
        total: 3674,
        status: 'PAID',
      },
      {
        id: 'INV-2026-002',
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        planName: 'Monthly Health+',
        amount: 3499,
        tax: 175,
        total: 3674,
        status: 'PAID',
      },
      {
        id: 'INV-2026-001',
        date: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        planName: 'Weekly Basket',
        amount: 999,
        tax: 50,
        total: 1049,
        status: 'PAID',
      },
    ];
  }

  getSubscriptionState(): UserSubscriptionState {
    if (typeof window === 'undefined') return this.getInitialState();
    try {
      const saved = localStorage.getItem(STORAGE_STATE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading subscription state:', e);
    }
    const state = this.getInitialState();
    this.saveSubscriptionState(state);
    return state;
  }

  saveSubscriptionState(state: UserSubscriptionState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving subscription state:', e);
    }
  }

  getInvoices(): Invoice[] {
    if (typeof window === 'undefined') return this.getInitialInvoices();
    try {
      const saved = localStorage.getItem(STORAGE_INVOICES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading invoices:', e);
    }
    const invoices = this.getInitialInvoices();
    this.saveInvoices(invoices);
    return invoices;
  }

  saveInvoices(invoices: Invoice[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_INVOICES_KEY, JSON.stringify(invoices));
    } catch (e) {
      console.error('Error saving invoices:', e);
    }
  }

  validateCoupon(code: string): CouponCode | null {
    const found = VALID_COUPONS.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase()
    );
    return found || null;
  }

  upgradeOrChangePlan(cycle: SubscriptionCycle, appliedCouponCode?: string): UserSubscriptionState {
    const targetPlan = SUBSCRIPTION_PLANS.find((p) => p.cycle === cycle) || SUBSCRIPTION_PLANS[1];
    const currentState = this.getSubscriptionState();

    let discount = 0;
    let coupon: CouponCode | null = null;
    if (appliedCouponCode) {
      coupon = this.validateCoupon(appliedCouponCode);
      if (coupon) discount = coupon.discountPercent;
    }

    const price = targetPlan.priceInr * (1 - discount / 100);
    const today = new Date();
    const end = new Date(today);

    if (cycle === 'weekly') end.setDate(today.getDate() + 7);
    else if (cycle === 'monthly') end.setMonth(today.getMonth() + 1);
    else if (cycle === 'quarterly') end.setMonth(today.getMonth() + 3);
    else if (cycle === 'yearly') end.setFullYear(today.getFullYear() + 1);

    const updatedState: UserSubscriptionState = {
      ...currentState,
      planId: cycle,
      planName: targetPlan.name,
      status: 'ACTIVE',
      autoRenew: true,
      startDate: today.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      amountPaid: Math.round(price),
      appliedCoupon: coupon ? coupon.code : undefined,
      discountPercent: discount > 0 ? discount : undefined,
    };

    this.saveSubscriptionState(updatedState);

    // Create new Invoice
    const newInvoice: Invoice = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: today.toISOString().split('T')[0],
      planName: targetPlan.name,
      amount: Math.round(price),
      tax: Math.round(price * 0.05),
      total: Math.round(price * 1.05),
      status: 'PAID',
    };

    const currentInvoices = this.getInvoices();
    this.saveInvoices([newInvoice, ...currentInvoices]);

    return updatedState;
  }

  renewSubscription(): UserSubscriptionState {
    const state = this.getSubscriptionState();
    const currentEnd = new Date(state.endDate);
    const newEnd = new Date(currentEnd);

    if (state.planId === 'weekly') newEnd.setDate(currentEnd.getDate() + 7);
    else if (state.planId === 'monthly') newEnd.setMonth(currentEnd.getMonth() + 1);
    else if (state.planId === 'quarterly') newEnd.setMonth(currentEnd.getMonth() + 3);
    else if (state.planId === 'yearly') newEnd.setFullYear(currentEnd.getFullYear() + 1);

    const updatedState: UserSubscriptionState = {
      ...state,
      status: 'ACTIVE',
      autoRenew: true,
      endDate: newEnd.toISOString().split('T')[0],
    };

    this.saveSubscriptionState(updatedState);

    // Create renewal invoice
    const newInvoice: Invoice = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      planName: `${state.planName} (Renewal)`,
      amount: state.amountPaid,
      tax: Math.round(state.amountPaid * 0.05),
      total: Math.round(state.amountPaid * 1.05),
      status: 'PAID',
    };

    const currentInvoices = this.getInvoices();
    this.saveInvoices([newInvoice, ...currentInvoices]);

    return updatedState;
  }

  cancelSubscription(): UserSubscriptionState {
    const state = this.getSubscriptionState();
    const updatedState: UserSubscriptionState = {
      ...state,
      status: 'CANCELED',
      autoRenew: false,
    };
    this.saveSubscriptionState(updatedState);
    return updatedState;
  }

  toggleAutoRenew(): UserSubscriptionState {
    const state = this.getSubscriptionState();
    const updatedState: UserSubscriptionState = {
      ...state,
      autoRenew: !state.autoRenew,
    };
    this.saveSubscriptionState(updatedState);
    return updatedState;
  }
}

export const subscriptionService = new SubscriptionService();
