'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus } from 'lucide-react';
import { Card } from '../common/Card';

interface WaterIntakeWidgetProps {
  currentMl: number;
  targetMl: number;
  onAddWater: (amountMl: number) => void;
}

export const WaterIntakeWidget: React.FC<WaterIntakeWidgetProps> = ({
  currentMl,
  targetMl,
  onAddWater,
}) => {
  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Droplet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Water Hydration</h3>
            <p className="text-[11px] text-slate-400">Daily fluid balance</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
          {percentage}%
        </span>
      </div>

      <div className="flex items-baseline justify-between z-10 relative pt-2">
        <div>
          <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {(currentMl / 1000).toFixed(2)}
          </span>
          <span className="text-sm font-bold text-slate-400 ml-1">L</span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Target: {(targetMl / 1000).toFixed(1)} L / day
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddWater(250)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> 250ml
          </button>
          <button
            onClick={() => onAddWater(500)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-900/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> 500ml
          </button>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50 relative z-10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </Card>
  );
};
