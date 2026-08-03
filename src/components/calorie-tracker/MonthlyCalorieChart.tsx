'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Award, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';

export interface MonthlyWeekPoint {
  weekLabel: string;
  avgCalories: number;
  onTargetDays: number;
}

interface MonthlyCalorieChartProps {
  weeks: MonthlyWeekPoint[];
}

export const MonthlyCalorieChart: React.FC<MonthlyCalorieChartProps> = ({ weeks }) => {
  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Monthly Calorie Overview</h3>
            <p className="text-[11px] text-slate-400">30-day average energy consistency</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> 84% Goal Consistency
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {weeks.map((week, idx) => (
          <div
            key={week.weekLabel}
            className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-2"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {week.weekLabel}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-slate-100">
                {week.avgCalories}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">kcal/day</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-400 pt-1 border-t border-slate-800">
              <span>Target Days:</span>
              <span className="font-bold">{week.onTargetDays} / 7 Days</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
