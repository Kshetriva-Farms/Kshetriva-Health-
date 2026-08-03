export interface AdminMetrics {
  totalRevenueInr: number;
  monthlyRecurringRevenue: number;
  totalSubscribers: number;
  activeSubscribers: number;
  ordersDelivered: number;
  pendingOrders: number;
  customerGrowthPercent: number;
  revenueGrowthPercent: number;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Subscriber' | 'Admin';
  subscriptionTier: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinedDate: string;
  ordersCount: number;
}

export interface AdminOrderRecord {
  id: string;
  customerName: string;
  email: string;
  itemsSummary: string;
  totalAmountInr: number;
  orderDate: string;
  status: 'Pending' | 'Dispatched' | 'Delivered' | 'Cancelled';
  deliverySlot: string;
}

export interface AdminVegetableRecord {
  id: string;
  name: string;
  category: 'Leafy Greens' | 'Root Veggies' | 'Gourds & Squash' | 'Herbs & Seasoning';
  stockKg: number;
  pricePerKgInr: number;
  isOrganic: boolean;
  harvestDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface AdminBroadcastNotification {
  id: string;
  title: string;
  message: string;
  targetAudience: 'All Users' | 'Active Subscribers' | 'VIP Members';
  sentDate: string;
  deliveredCount: number;
}
