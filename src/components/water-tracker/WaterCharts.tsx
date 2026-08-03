'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplet, Award, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';

export interface WeeklyWaterPoint {
  dayLabel: string;
  date: string;
  amountMl: number;
  targetMl: number;
}

interface WaterChartsProps {
  weeklyData: WeeklyWaterPoint[];
}

export const WaterCharts: React.FC<WaterChartsProps> = ({ weeklyData }) => {
  const maxVal = Math.max(3500, ...weeklyData.map((d) => d.amountMl));

  const averageMl = Math.round(
    weeklyData.reduce((acc, d) => acc + d.amountMl, 0) / (weeklyData.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* 7-Day Weekly Chart */}
      <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">7-Day Hydration Trend</h3>
              <p className="text-[11px] text-slate-400">Daily intake history in Liters</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400">Weekly Avg: </span>
            <span className="text-xs font-extrabold text-cyan-400">
              {(averageMl / 1000).toFixed(2)} L/day
            </span>
          </div>
        </div>

        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800 relative">
          {/* Target Reference Line */}
          <div className="absolute top-10 left-0 right-0 border-t border-dashed border-cyan-500/30 flex justify-end pr-2">
            <span className="text-[9px] font-bold text-cyan-400/70 bg-slate-900 px-1 -mt-2.5">
              3.0 Liter Target Goal
            </span>
          </div>

          {weeklyData.map((item, idx) => {
            const heightPct = Math.min(100, Math.round((item.amountMl / maxVal) * 100));
            const isTargetMet = item.amountMl >= item.targetMl;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-extrabold text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-700 shadow-md">
                  {(item.amountMl / 1000).toFixed(2)}L
                </span>

                <div className="w-full max-w-[28px] bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden p-0.5">
                  <motion.div
                    className={`w-full rounded-t-lg bg-gradient-to-t ${
                      isTargetMet ? 'from-cyan-600 via-teal-500 to-emerald-400' : 'from-blue-600 to-cyan-400'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                  />
                </div>

                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                  {item.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 30-Day Monthly Hydration Consistency Card */}
      <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Monthly Hydration Score</h3>
              <p className="text-[11px] text-slate-400">30-day target adherence rate</p>
            </div>
          </div>

          <span className="text-xs font-extrabold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
            92% Optimal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Days Met Goal</p>
            <p className="text-xl font-extrabold text-teal-300">27 / 30</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Intake</p>
            <p className="text-xl font-extrabold text-cyan-300">88.5 Liters</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Longest Streak</p>
            <p className="text-xl font-extrabold text-emerald-300">14 Days</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Hydration Level</p>
            <p className="text-xl font-extrabold text-amber-300">Optimal</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
