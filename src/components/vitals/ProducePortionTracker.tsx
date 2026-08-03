'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Leaf, Plus, Minus, CheckCircle2 } from 'lucide-react';

interface ProducePortionTrackerProps {
  portionsLogged: number;
  onUpdatePortions: (val: number) => void;
}

export const ProducePortionTracker: React.FC<ProducePortionTrackerProps> = ({
  portionsLogged,
  onUpdatePortions,
}) => {
  const maxPortions = 5;

  return (
    <Card className="space-y-6 border-brand-500/20 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <Badge variant="emerald">Farm Harvest Tracker</Badge>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              5-a-Day Organic Veggie Target
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdatePortions(Math.max(0, portionsLogged - 1))}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-2xl font-black text-brand-600 dark:text-emerald-400 px-2">
            {portionsLogged} / {maxPortions}
          </span>
          <button
            onClick={() => onUpdatePortions(Math.min(maxPortions, portionsLogged + 1))}
            className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Portion Cards Grid */}
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: maxPortions }).map((_, idx) => {
          const isFilled = idx < portionsLogged;
          return (
            <button
              key={idx}
              onClick={() => onUpdatePortions(idx + 1)}
              className={`h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                isFilled
                  ? 'bg-gradient-to-tr from-brand-600 to-emerald-500 text-white shadow-md scale-105'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 hover:border-brand-500/50'
              }`}
            >
              <span className="text-xl">{isFilled ? '🥗' : '🥦'}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest">
                Portion {idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {portionsLogged >= maxPortions ? (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Outstanding! You completed all 5 farm-harvest organic portions for maximum enzymatic cellular vitality today.
        </div>
      ) : (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
          Log {maxPortions - portionsLogged} more organic produce portions from your Kshetriva basket to hit today's longevity target.
        </p>
      )}
    </Card>
  );
};
