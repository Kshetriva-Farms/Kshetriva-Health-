'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Dumbbell, Wheat, Droplets } from 'lucide-react';
import { Card } from '../common/Card';

interface MacroItem {
  name: string;
  consumed: number;
  target: number;
  unit: string;
  color: string;
  barColor: string;
  icon: React.ReactNode;
}

interface MacroBreakdownWidgetProps {
  protein: { consumed: number; target: number };
  carbs: { consumed: number; target: number };
  fat: { consumed: number; target: number };
}

export const MacroBreakdownWidget: React.FC<MacroBreakdownWidgetProps> = ({
  protein,
  carbs,
  fat,
}) => {
  const macros: MacroItem[] = [
    {
      name: 'Protein',
      consumed: protein.consumed,
      target: protein.target,
      unit: 'g',
      color: 'text-rose-400',
      barColor: 'from-rose-500 to-pink-500',
      icon: <Dumbbell className="w-3.5 h-3.5 text-rose-400" />,
    },
    {
      name: 'Carbs',
      consumed: carbs.consumed,
      target: carbs.target,
      unit: 'g',
      color: 'text-cyan-400',
      barColor: 'from-cyan-500 to-blue-500',
      icon: <Wheat className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      name: 'Fat',
      consumed: fat.consumed,
      target: fat.target,
      unit: 'g',
      color: 'text-amber-400',
      barColor: 'from-amber-500 to-orange-500',
      icon: <Droplets className="w-3.5 h-3.5 text-amber-400" />,
    },
  ];

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Macro Split</h3>
            <p className="text-[11px] text-slate-400">Daily nutrient goals</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {macros.map((macro) => {
          const pct = Math.min(100, Math.round((macro.consumed / macro.target) * 100));
          return (
            <div key={macro.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                  {macro.icon} {macro.name}
                </span>
                <span className="text-slate-400 font-medium">
                  <strong className={macro.color}>{macro.consumed}</strong> / {macro.target} {macro.unit}
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${macro.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
