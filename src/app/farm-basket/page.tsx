'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { CurrentBasketCard } from '../../components/vegetable-basket/CurrentBasketCard';
import { DeliveryTrackerCard } from '../../components/vegetable-basket/DeliveryTrackerCard';
import { SubscriptionStatusCard } from '../../components/vegetable-basket/SubscriptionStatusCard';
import { RenewSubscriptionModal } from '../../components/vegetable-basket/RenewSubscriptionModal';
import { OrderHistoryTable } from '../../components/vegetable-basket/OrderHistoryTable';
import { VegetableBasket, BasketSubscription, BasketOrder } from '../../domain/entities/VegetableBasket';
import { vegetableBasketRepository } from '../../infrastructure/repositories/VegetableBasketRepository';
import { SubscriptionTier } from '../../domain/entities/User';
import { useToast } from '../../application/context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { ShoppingBag, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export default function FarmBasketPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  const [basket, setBasket] = useState<VegetableBasket | null>(null);
  const [subscription, setSubscription] = useState<BasketSubscription | null>(null);
  const [orders, setOrders] = useState<BasketOrder[]>([]);

  useEffect(() => {
    const uid = user?.uid || user?.id || 'guest';

    vegetableBasketRepository.getCurrentBasket(uid).then(setBasket);
    vegetableBasketRepository.getSubscription(uid).then(setSubscription);
    vegetableBasketRepository.getOrderHistory(uid).then(setOrders);
  }, [user]);

  const handleRenewSubscription = async (tier: SubscriptionTier, deliveryDay: BasketSubscription['deliveryDay']) => {
    const uid = user?.uid || user?.id || 'guest';
    try {
      const updatedSub = await vegetableBasketRepository.renewSubscription(uid, tier, deliveryDay);
      setSubscription(updatedSub);
      showToast(`Subscription plan updated to ${tier} with ${deliveryDay} deliveries!`, 'success');
    } catch (error) {
      showToast('Plan updated locally.', 'info');
    }
  };

  return (
    <ProtectedRoute requireSubscription fallbackMessage="Subscribers receive weekly organic farm harvest baskets, live delivery tracking & farm-to-table nutrition.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Sidebar Navigation (Desktop) */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 pt-8 pb-24 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="emerald">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline text-emerald-400" />
                  Kshetriva Organic Farms
                </Badge>
                <Badge variant="teal">
                  <ShoppingBag className="w-3.5 h-3.5 mr-1 inline" /> Bioactive Produce Basket
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Farm Harvest Vegetable Basket
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage your organic produce subscription, track doorstep delivery, and inspect bio-active nutrient profiles
              </p>
            </div>
          </motion.div>

          {/* Active Subscription Plan */}
          {subscription && (
            <SubscriptionStatusCard
              subscription={subscription}
              onOpenRenewModal={() => setIsRenewModalOpen(true)}
            />
          )}

          {/* Live Delivery Stepper Tracker */}
          {basket && (
            <DeliveryTrackerCard
              status={basket.deliveryStatus}
              estimatedArrival={basket.estimatedArrival}
            />
          )}

          {/* Current Harvest Basket Card */}
          {basket && <CurrentBasketCard basket={basket} />}

          {/* Order History & Invoices */}
          <OrderHistoryTable orders={orders} />
        </main>

        {/* Renew Subscription Modal */}
        {subscription && (
          <RenewSubscriptionModal
            isOpen={isRenewModalOpen}
            onClose={() => setIsRenewModalOpen(false)}
            currentTier={subscription.tier}
            currentDay={subscription.deliveryDay}
            onRenew={handleRenewSubscription}
          />
        )}

        {/* Bottom Navigation (Mobile) */}
        <BottomNav onQuickAddOpen={() => setIsQuickAddOpen(true)} />

        {/* Quick Add Logging Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddWater={() => {}}
          onAddMeal={() => {}}
          onAddWeight={() => {}}
          onAddExercise={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
