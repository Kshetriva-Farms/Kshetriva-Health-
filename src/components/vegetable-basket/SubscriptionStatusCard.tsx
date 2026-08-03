'use client';

import React from 'react';
import { ShieldCheck, Calendar, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { BasketSubscription } from '../../domain/entities/VegetableBasket';

interface SubscriptionStatusCardProps {
  subscription: BasketSubscription;
  onOpenRenewModal: () => void;
}

export const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({
  subscription,
  onOpenRenewModal,
}) => {
  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'WEEKLY_BASKET':
        return 'Weekly Harvest Basket';
      case 'BIWEEKLY_BASKET':
        return 'Bi-Weekly Harvest Basket';
      case 'MONTHLY_BASKET':
        return 'Monthly Harvest Basket';
      case 'VIP_HEALTH_PLUS':
        return 'VIP Health+ Unlimited';
      default:
        return 'Standard Plan';
    }
  };

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Badge variant="emerald">ACTIVE SUBSCRIPTION</Badge>
              <Badge variant="teal">
                <Sparkles className="w-3 h-3 mr-1 inline" /> Kshetriva Direct
              </Badge>
            </div>
            <h3 className="text-base font-extrabold text-slate-100">
              {getTierLabel(subscription.tier)}
            </h3>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={onOpenRenewModal}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="text-xs py-2 px-3.5 shadow-emerald-900/40"
        >
          Renew / Manage Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Preferred Delivery Day</span>
          <p className="text-sm font-extrabold text-slate-200">{subscription.deliveryDay}s</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Next Scheduled Harvest</span>
          <p className="text-sm font-extrabold text-emerald-300">{subscription.nextDeliveryDate}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Monthly Price</span>
          <p className="text-sm font-extrabold text-amber-300">${subscription.priceMonthly} / mo</p>
        </div>
      </div>
    </Card>
  );
};
