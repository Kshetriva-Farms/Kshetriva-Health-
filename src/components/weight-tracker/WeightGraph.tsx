'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Calendar, Award } from 'lucide-react';
import { Card } from '../common/Card';
import { WeightLogEntry } from '../../domain/entities/WeightLog';

interface WeightGraphProps {
  entries: WeightLogEntry[];
  targetWeightKg: number;
}

export const WeightGraph: React.FC<WeightGraphProps> = ({ entries, targetWeightKg }) => {
  // Format entries for chart display (chronological order)
  const chartData = [...entries].reverse();
  const maxWeight = Math.max(75, ...chartData.map((e) => e.weightKg));
  const minWeight = Math.min(60, ...chartData.map((e) => e.weightKg));
  const range = maxWeight - minWeight || 10;

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Weight Progress Trend</h3>
            <p className="text-[11px] text-slate-400">Historical weight trajectory vs goal</p>
          </div>
        </div>

        <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> Target: {targetWeightKg} kg
        </span>
      </div>

      <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800 relative">
        {/* Target Weight Goal Reference Line */}
        <div className="absolute top-12 left-0 right-0 border-t border-dashed border-emerald-500/40 flex justify-end pr-2">
          <span className="text-[9px] font-bold text-emerald-400/80 bg-slate-900 px-1.5 -mt-2.5 rounded">
            Target Goal: {targetWeightKg} kg
          </span>
        </div>

        {chartData.map((item, idx) => {
          const heightPct = Math.min(100, Math.max(20, Math.round(((item.weightKg - minWeight) / range) * 100)));

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              {/* Tooltip on Hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-extrabold text-emerald-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 shadow-md">
                {item.weightKg} kg (BMI: {item.bmi})
              </div>

              {/* Bar */}
              <div className="w-full max-w-[28px] bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden p-0.5">
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>

              {/* Date Label */}
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors truncate max-w-[45px]">
                {item.loggedAt.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
