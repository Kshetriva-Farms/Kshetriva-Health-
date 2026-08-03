import { SubscriptionTier } from './User';

export interface FarmProduceItem {
  id: string;
  name: string;
  category: 'Leafy Greens' | 'Root Vegetables' | 'Herbs' | 'Exotic Produce' | 'Farm Fruits';
  quantity: string; // e.g. "500g", "1 kg", "2 heads"
  keyNutrients: string[];
  caloriesPerPortion: number;
}

export type DeliveryStatus = 'Harvesting' | 'Quality Inspected' | 'In Transit' | 'Out for Delivery' | 'Delivered';

export interface VegetableBasket {
  id: string;
  basketName: string;
  deliveryDate: string; // YYYY-MM-DD
  deliveryStatus: DeliveryStatus;
  estimatedArrival: string; // e.g. "Tomorrow by 10:00 AM"
  produceList: FarmProduceItem[];
  totalProduceWeightKg: number;
  nutritionSummary: {
    fiberG: number;
    vitCMg: number;
    ironMg: number;
    folateMcg: number;
  };
}

export interface BasketSubscription {
  id?: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  deliveryDay: 'Monday' | 'Wednesday' | 'Friday' | 'Saturday';
  nextDeliveryDate: string;
  autoRenew: boolean;
  priceMonthly: number;
}

export interface BasketOrder {
  id: string;
  orderNumber: string;
  deliveryDate: string;
  itemsCount: number;
  totalAmount: number;
  status: 'Delivered' | 'In Transit' | 'Scheduled';
  invoiceUrl: string;
  harvestLocation: string;
}
