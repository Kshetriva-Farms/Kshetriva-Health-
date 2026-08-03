'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Timer } from 'lucide-react';
import { Card } from '../common/Card';

interface ExerciseProgressWidgetProps {
  activeMinutes: number;
  targetMinutes: number;
  caloriesBurned: number;
}

export const ExerciseProgressWidget: React.FC<ExerciseProgressWidgetProps> = ({
  activeMinutes,
  targetMinutes,
  caloriesBurned,
}) => {
  const percentage = Math.min(100, Math.round((activeMinutes / targetMinutes) * 100));

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Exercise Progress</h3>
            <p className="text-[11px] text-slate-400">Daily movement goal</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
          {percentage}% Done
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Timer className="w-3.5 h-3.5 text-purple-400" /> Active Duration
          </div>
          <p className="text-xl font-extrabold text-slate-100">
            {activeMinutes} <span className="text-xs font-bold text-slate-400">/ {targetMinutes} min</span>
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Burned Energy
          </div>
          <p className="text-xl font-extrabold text-amber-300">
            {caloriesBurned} <span className="text-xs font-bold text-slate-400">kcal</span>
          </p>
        </div>
      </div>

      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </Card>
  );
};
