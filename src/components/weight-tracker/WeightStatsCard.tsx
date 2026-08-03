'use client';

import React from 'react';
import { Scale, Target, Activity, Percent, TrendingDown, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';

interface WeightStatsCardProps {
  currentWeightKg: number;
  targetWeightKg: number;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bodyFatPct?: number;
}

export const WeightStatsCard: React.FC<WeightStatsCardProps> = ({
  currentWeightKg,
  targetWeightKg,
  bmi,
  bmiCategory,
  bodyFatPct = 18.5,
}) => {
  const diffKg = Math.round(Math.abs(currentWeightKg - targetWeightKg) * 10) / 10;
  const isGoalMet = currentWeightKg === targetWeightKg;
  const isLossGoal = currentWeightKg > targetWeightKg;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Weight */}
      <Card className="p-5 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Current Weight</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {currentWeightKg} <span className="text-sm font-bold text-slate-400">kg</span>
          </span>
          <span className="text-xs text-slate-400">({(currentWeightKg * 2.20462).toFixed(1)} lbs)</span>
        </div>
      </Card>

      {/* Target Weight Goal */}
      <Card className="p-5 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Target Weight</span>
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {targetWeightKg} <span className="text-sm font-bold text-slate-400">kg</span>
          </span>
          <span className="text-xs font-bold text-teal-400">
            {isGoalMet ? 'Goal Met!' : `${diffKg} kg to ${isLossGoal ? 'lose' : 'gain'}`}
          </span>
        </div>
      </Card>

      {/* BMI Score & Clinical Category */}
      <Card className="p-5 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">BMI Index</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {bmi}
          </span>
          <span
            className={`text-xs font-extrabold px-2 py-0.5 rounded-full border uppercase ${
              bmiCategory === 'Normal'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {bmiCategory}
          </span>
        </div>
      </Card>

      {/* Optional Body Fat % */}
      <Card className="p-5 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Body Fat % (Optional)</span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {bodyFatPct}%
          </span>
          <span className="text-xs font-semibold text-purple-300">Athletic Range</span>
        </div>
      </Card>
    </div>
  );
};
