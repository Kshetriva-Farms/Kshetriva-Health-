'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { SubscriptionTier } from '../../domain/entities/User';
import { BasketSubscription } from '../../domain/entities/VegetableBasket';
import { Check, Sparkles, ShieldCheck } from 'lucide-react';

interface RenewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  currentDay: BasketSubscription['deliveryDay'];
  onRenew: (tier: SubscriptionTier, deliveryDay: BasketSubscription['deliveryDay']) => void;
}

export const RenewSubscriptionModal: React.FC<RenewSubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  currentDay,
  onRenew,
}) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(currentTier);
  const [deliveryDay, setDeliveryDay] = useState<BasketSubscription['deliveryDay']>(currentDay);

  const plans: { tier: SubscriptionTier; name: string; price: string; desc: string }[] = [
    { tier: 'WEEKLY_BASKET', name: 'Weekly Harvest Basket', price: '$49/mo', desc: '4.5kg fresh organic vegetables delivered every week' },
    { tier: 'BIWEEKLY_BASKET', name: 'Bi-Weekly Harvest Basket', price: '$89/mo', desc: 'Deliveries every 2 weeks with double leaf greens' },
    { tier: 'MONTHLY_BASKET', name: 'Monthly Harvest Basket', price: '$159/mo', desc: 'Large monthly harvest box for full family nutrition' },
    { tier: 'VIP_HEALTH_PLUS', name: 'VIP Health+ Unlimited', price: '$249/mo', desc: 'Custom farm orders + unlimited 24/7 AI Health advice' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRenew(selectedTier, deliveryDay);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Renew or Upgrade Farm Subscription">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tier Selector List */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Select Basket Subscription Plan</label>
          <div className="space-y-2">
            {plans.map((p) => {
              const isSelected = selectedTier === p.tier;
              return (
                <div
                  key={p.tier}
                  onClick={() => setSelectedTier(p.tier)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block">{p.name}</span>
                    <span className="text-[10px] text-slate-400 block">{p.desc}</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-400 shrink-0">{p.price}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferred Delivery Day */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Preferred Delivery Day</label>
          <select
            value={deliveryDay}
            onChange={(e) => setDeliveryDay(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="Monday">Monday Morning</option>
            <option value="Wednesday">Wednesday Morning</option>
            <option value="Friday">Friday Morning</option>
            <option value="Saturday">Saturday Morning</option>
          </select>
        </div>

        <Button variant="primary" type="submit" className="w-full py-2.5">
          <Check className="w-4 h-4 mr-1.5" /> Confirm Subscription Plan
        </Button>
      </form>
    </Modal>
  );
};
