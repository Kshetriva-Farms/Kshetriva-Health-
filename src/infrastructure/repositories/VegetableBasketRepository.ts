import { IVegetableBasketRepository } from '../../domain/repositories/IVegetableBasketRepository';
import { VegetableBasket, BasketSubscription, BasketOrder } from '../../domain/entities/VegetableBasket';
import { SubscriptionTier } from '../../domain/entities/User';
import { firestoreService } from '../services/firestoreService';

export class VegetableBasketRepository implements IVegetableBasketRepository {
  async getCurrentBasket(userId: string): Promise<VegetableBasket> {
    const existing = await firestoreService.getDocument<VegetableBasket>('farm_baskets', userId);
    if (existing) return existing;

    // Default Fresh Organic Harvest Basket
    const defaultBasket: VegetableBasket = {
      id: userId,
      basketName: 'Organic Vitality Farm Harvest #42',
      deliveryDate: '2026-07-29',
      deliveryStatus: 'Out for Delivery',
      estimatedArrival: 'Tomorrow by 10:30 AM',
      totalProduceWeightKg: 4.5,
      produceList: [
        { id: 'p1', name: 'Organic Fresh Spinach', category: 'Leafy Greens', quantity: '500g', keyNutrients: ['Folate', 'Iron', 'Vitamin K'], caloriesPerPortion: 115 },
        { id: 'p2', name: 'Heritage Farm Carrots', category: 'Root Vegetables', quantity: '1.0 kg', keyNutrients: ['Beta-Carotene', 'Fiber'], caloriesPerPortion: 410 },
        { id: 'p3', name: 'Crisp Red Bell Peppers', category: 'Exotic Produce', quantity: '2 large', keyNutrients: ['Vitamin C', 'Antioxidants'], caloriesPerPortion: 62 },
        { id: 'p4', name: 'Broccoli Florets', category: 'Leafy Greens', quantity: '1 head (400g)', keyNutrients: ['Sulforaphane', 'Vitamin C'], caloriesPerPortion: 136 },
        { id: 'p5', name: 'Organic Fresh Mint & Basil', category: 'Herbs', quantity: '100g bunch', keyNutrients: ['Menthol', 'Flavonoids'], caloriesPerPortion: 40 },
      ],
      nutritionSummary: {
        fiberG: 28.5,
        vitCMg: 320,
        ironMg: 14.2,
        folateMcg: 480,
      },
    };

    await firestoreService.setDocument('farm_baskets', userId, defaultBasket);
    return defaultBasket;
  }

  async getSubscription(userId: string): Promise<BasketSubscription> {
    const existing = await firestoreService.getDocument<BasketSubscription>('farm_subscriptions', userId);
    if (existing) return existing;

    const defaultSub: BasketSubscription = {
      id: userId,
      userId,
      tier: 'WEEKLY_BASKET',
      status: 'ACTIVE',
      deliveryDay: 'Wednesday',
      nextDeliveryDate: '2026-07-29',
      autoRenew: true,
      priceMonthly: 49,
    };

    await firestoreService.setDocument('farm_subscriptions', userId, defaultSub);
    return defaultSub;
  }

  async renewSubscription(
    userId: string,
    tier: SubscriptionTier,
    deliveryDay: BasketSubscription['deliveryDay']
  ): Promise<BasketSubscription> {
    const prices: Record<string, number> = {
      WEEKLY_BASKET: 49,
      BIWEEKLY_BASKET: 89,
      MONTHLY_BASKET: 159,
      VIP_HEALTH_PLUS: 249,
    };

    const updatedSub: BasketSubscription = {
      id: userId,
      userId,
      tier,
      status: 'ACTIVE',
      deliveryDay,
      nextDeliveryDate: '2026-07-29',
      autoRenew: true,
      priceMonthly: prices[tier] || 49,
    };

    await firestoreService.setDocument('farm_subscriptions', userId, updatedSub);
    return updatedSub;
  }

  async getOrderHistory(userId: string): Promise<BasketOrder[]> {
    return [
      {
        id: 'ord-101',
        orderNumber: 'KSH-2026-8891',
        deliveryDate: '2026-07-22',
        itemsCount: 5,
        totalAmount: 49.00,
        status: 'Delivered',
        invoiceUrl: '#',
        harvestLocation: 'Kshetriva Organic Farm 3, Field B',
      },
      {
        id: 'ord-102',
        orderNumber: 'KSH-2026-8432',
        deliveryDate: '2026-07-15',
        itemsCount: 6,
        totalAmount: 49.00,
        status: 'Delivered',
        invoiceUrl: '#',
        harvestLocation: 'Kshetriva Organic Farm 1, Greenhouse 4',
      },
      {
        id: 'ord-103',
        orderNumber: 'KSH-2026-7988',
        deliveryDate: '2026-07-08',
        itemsCount: 5,
        totalAmount: 49.00,
        status: 'Delivered',
        invoiceUrl: '#',
        harvestLocation: 'Kshetriva Organic Farm 2, Field A',
      },
    ];
  }
}

export const vegetableBasketRepository = new VegetableBasketRepository();
