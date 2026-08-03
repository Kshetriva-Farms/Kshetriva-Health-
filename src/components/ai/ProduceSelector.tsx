'use client';

import React from 'react';
import { ProduceItem } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Check, Leaf } from 'lucide-react';

interface ProduceSelectorProps {
  availableProduce: ProduceItem[];
  selectedProduceIds: string[];
  onToggleProduce: (id: string) => void;
}

export const ProduceSelector: React.FC<ProduceSelectorProps> = ({
  availableProduce,
  selectedProduceIds,
  onToggleProduce,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-emerald-500" />
          Select Vegetables in Your Current Farm Basket:
        </label>
        <span className="text-xs font-semibold text-brand-600 dark:text-emerald-400">
          {selectedProduceIds.length} Selected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {availableProduce.map((item) => {
          const isSelected = selectedProduceIds.includes(item.id);
          return (
            <Card
              key={item.id}
              onClick={() => onToggleProduce(item.id)}
              className={`cursor-pointer transition-all duration-200 p-4 relative ${
                isSelected
                  ? 'border-2 border-brand-500 bg-brand-50/60 dark:bg-brand-950/50 shadow-md scale-[1.02]'
                  : 'hover:border-brand-500/30 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{item.icon}</span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-brand-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {item.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.category}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                {item.keyVitamins.slice(0, 2).map((vit, idx) => (
                  <Badge key={idx} variant="emerald">
                    {vit}
                  </Badge>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
