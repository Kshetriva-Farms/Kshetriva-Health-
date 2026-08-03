'use client';

import React from 'react';
import { Sprout, CheckCircle, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';

interface ProduceItem {
  id: string;
  name: string;
  benefit: string;
  portions: number;
}

interface VegetableBasketWidgetProps {
  loggedPortions: number;
  targetPortions: number;
  onUpdatePortions?: (val: number) => void;
}

export const VegetableBasketWidget: React.FC<VegetableBasketWidgetProps> = ({
  loggedPortions,
  targetPortions,
  onUpdatePortions,
}) => {
  const harvestItems: ProduceItem[] = [
    { id: '1', name: 'Organic Spinach', benefit: 'Bioavailable Iron & Folate', portions: 2 },
    { id: '2', name: 'Heritage Carrots', benefit: 'Beta-Carotene & Fiber', portions: 1 },
    { id: '3', name: 'Red Bell Pepper', benefit: 'Vitamin C Antioxidants', portions: 1 },
  ];

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Today's Vegetable Basket</h3>
            <p className="text-[11px] text-slate-400">Farm-to-table organic harvest</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdatePortions && onUpdatePortions(Math.max(0, loggedPortions - 1))}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
          >
            -
          </button>
          <span className="text-xs font-extrabold text-emerald-400 px-2">
            {loggedPortions} / {targetPortions} Portions
          </span>
          <button
            onClick={() => onUpdatePortions && onUpdatePortions(loggedPortions + 1)}
            className="w-7 h-7 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {harvestItems.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 space-y-1 hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-200">{item.name}</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[10px] text-slate-400">{item.benefit}</p>
            <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {item.portions} Portion{item.portions > 1 ? 's' : ''}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
