'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Flame, PieChart } from 'lucide-react';

interface CalorieMacroChartProps {
  caloriesConsumed: number;
  targetCalories: number;
}

export const CalorieMacroChart: React.FC<CalorieMacroChartProps> = ({
  caloriesConsumed,
  targetCalories,
}) => {
  const macros = [
    { label: 'Plant Protein', val: '45g', target: '60g', color: 'bg-emerald-500', pct: 75 },
    { label: 'Dietary Fiber', val: '32g', target: '35g', color: 'bg-amber-500', pct: 91 },
    { label: 'Complex Carbs', val: '140g', target: '180g', color: 'bg-sky-500', pct: 78 },
    { label: 'Healthy Lipid Fats', val: '42g', target: '55g', color: 'bg-rose-500', pct: 76 },
  ];

  return (
    <Card className="space-y-6 border-amber-500/20 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-500 shadow-md">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <Badge variant="amber">Nutrient Distribution</Badge>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              Calories & Macro Balance
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {caloriesConsumed}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            / {targetCalories} kcal
          </span>
        </div>
      </div>

      {/* Macro Breakdown List */}
      <div className="space-y-3">
        {macros.map((macro, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>{macro.label}</span>
              <span className="font-mono text-slate-500">
                {macro.val} / {macro.target}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`${macro.color} h-full rounded-full transition-all duration-500`}
                style={{ width: `${macro.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
