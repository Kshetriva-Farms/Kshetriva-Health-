'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Dumbbell, Wheat, Droplets } from 'lucide-react';
import { Card } from '../common/Card';

interface DailyProgressCircleProps {
  consumedCalories: number;
  targetCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export const DailyProgressCircle: React.FC<DailyProgressCircleProps> = ({
  consumedCalories,
  targetCalories,
  totalProtein,
  totalCarbs,
  totalFat,
}) => {
  const remaining = Math.max(0, targetCalories - consumedCalories);
  const percentage = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));

  const size = 180;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Daily Calorie Progress</h3>
            <p className="text-[11px] text-slate-400">Energy & Macro totals today</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          {percentage}% Achieved
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-800"
              fill="transparent"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#trackerCalorieGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="trackerCalorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
              {consumedCalories}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              kcal logged
            </span>
          </div>
        </div>

        {/* Target & Remaining Summary */}
        <div className="w-full sm:w-auto space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Daily Goal</p>
              <p className="text-base font-bold text-slate-200">{targetCalories} kcal</p>
            </div>
            <div className="w-2 h-8 rounded-full bg-slate-700" />
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold text-emerald-400 uppercase">Calories Remaining</p>
              <p className="text-lg font-extrabold text-emerald-300">{remaining} kcal</p>
            </div>
            <div className="w-2 h-8 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* Macro Totals Bar */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-rose-400">
            <Dumbbell className="w-3 h-3" /> Protein
          </div>
          <p className="text-base font-extrabold text-rose-200">{Math.round(totalProtein)}g</p>
        </div>

        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-cyan-400">
            <Wheat className="w-3 h-3" /> Carbs
          </div>
          <p className="text-base font-extrabold text-cyan-200">{Math.round(totalCarbs)}g</p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-400">
            <Droplets className="w-3 h-3" /> Fat
          </div>
          <p className="text-base font-extrabold text-amber-200">{Math.round(totalFat)}g</p>
        </div>
      </div>
    </Card>
  );
};
