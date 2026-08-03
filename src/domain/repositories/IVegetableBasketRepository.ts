import { VegetableBasket, BasketSubscription, BasketOrder } from '../entities/VegetableBasket';
import { SubscriptionTier } from '../entities/User';

export interface IVegetableBasketRepository {
  getCurrentBasket(userId: string): Promise<VegetableBasket>;
  getSubscription(userId: string): Promise<BasketSubscription>;
  renewSubscription(userId: string, tier: SubscriptionTier, deliveryDay: BasketSubscription['deliveryDay']): Promise<BasketSubscription>;
  getOrderHistory(userId: string): Promise<BasketOrder[]>;
}
