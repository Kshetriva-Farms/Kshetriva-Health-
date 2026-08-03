'use client';

import React from 'react';
import { Scale, Activity, TrendingDown } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface WeightBmiWidgetProps {
  weightKg: number;
  heightCm?: number;
}

export const WeightBmiWidget: React.FC<WeightBmiWidgetProps> = ({
  weightKg,
  heightCm = 175,
}) => {
  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);
  const bmiVal = parseFloat(bmi);

  let bmiCategory = 'Normal Weight';
  let badgeVariant: 'emerald' | 'amber' | 'teal' | 'rose' | 'stone' = 'emerald';

  if (bmiVal < 18.5) {
    bmiCategory = 'Underweight';
    badgeVariant = 'amber';
  } else if (bmiVal >= 18.5 && bmiVal <= 24.9) {
    bmiCategory = 'Optimal Healthy';
    badgeVariant = 'emerald';
  } else if (bmiVal >= 25 && bmiVal <= 29.9) {
    bmiCategory = 'Overweight';
    badgeVariant = 'amber';
  } else {
    bmiCategory = 'High Risk';
    badgeVariant = 'rose';
  }

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Weight & BMI</h3>
            <p className="text-[11px] text-slate-400">Body composition index</p>
          </div>
        </div>
        <Badge variant={badgeVariant}>{bmiCategory}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Current Weight</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-100">{weightKg}</span>
            <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingDown className="w-3 h-3" /> -0.4 kg this week
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Body Mass Index</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-teal-300">{bmi}</span>
            <span className="text-xs font-bold text-slate-400">BMI</span>
          </div>
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-teal-400" /> Height: {heightCm} cm
          </p>
        </div>
      </div>
    </Card>
  );
};
