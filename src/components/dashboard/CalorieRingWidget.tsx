'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';
import { Card } from '../common/Card';

interface CalorieRingWidgetProps {
  consumed: number;
  target: number;
}

export const CalorieRingWidget: React.FC<CalorieRingWidgetProps> = ({ consumed, target }) => {
  const remaining = Math.max(0, target - consumed);
  const percentage = Math.min(100, Math.round((consumed / target) * 100));

  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-6 relative overflow-hidden bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Calories Summary</h3>
            <p className="text-[11px] text-slate-400">Daily energy balance</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold flex items-center gap-1">
          <Zap className="w-3 h-3" /> {percentage}% Target
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        {/* SVG Circular Progress Ring */}
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
              stroke="url(#calorieGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-slate-100 tracking-tight">
              {consumed}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              kcal eaten
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full sm:w-auto space-y-3">
          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Target</p>
              <p className="text-sm font-bold text-slate-200">{target} kcal</p>
            </div>
            <div className="w-2 h-8 rounded-full bg-slate-700" />
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold text-emerald-400 uppercase">Remaining</p>
              <p className="text-base font-extrabold text-emerald-300">{remaining} kcal</p>
            </div>
            <div className="w-2 h-8 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </Card>
  );
};
