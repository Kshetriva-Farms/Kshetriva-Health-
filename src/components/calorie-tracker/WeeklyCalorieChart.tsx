'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';

export interface DailyDataPoint {
  dayLabel: string;
  date: string;
  calories: number;
  target: number;
}

interface WeeklyCalorieChartProps {
  data: DailyDataPoint[];
}

export const WeeklyCalorieChart: React.FC<WeeklyCalorieChartProps> = ({ data }) => {
  const maxVal = Math.max(2500, ...data.map((d) => d.calories));

  const averageCalories = Math.round(
    data.reduce((acc, d) => acc + d.calories, 0) / (data.length || 1)
  );

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">7-Day Weekly Calorie Trend</h3>
            <p className="text-[11px] text-slate-400">Daily intake history</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400">Weekly Avg: </span>
          <span className="text-xs font-extrabold text-emerald-400">{averageCalories} kcal/day</span>
        </div>
      </div>

      {/* Bar Chart Grid */}
      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800 relative">
        {/* Target Dotted Reference Line */}
        <div className="absolute top-10 left-0 right-0 border-t border-dashed border-emerald-500/30 flex justify-end pr-2">
          <span className="text-[9px] font-bold text-emerald-400/70 bg-slate-900 px-1 -mt-2.5">
            2,000 kcal Target
          </span>
        </div>

        {data.map((item, idx) => {
          const heightPct = Math.min(100, Math.round((item.calories / maxVal) * 100));
          const isOver = item.calories > item.target;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              {/* Tooltip on Hover */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-extrabold text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-700 shadow-md">
                {item.calories}
              </span>

              {/* Bar */}
              <div className="w-full max-w-[28px] bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden p-0.5">
                <motion.div
                  className={`w-full rounded-t-lg bg-gradient-to-t ${
                    isOver ? 'from-amber-600 to-rose-500' : 'from-emerald-600 to-teal-400'
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>

              {/* Day Label */}
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                {item.dayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
