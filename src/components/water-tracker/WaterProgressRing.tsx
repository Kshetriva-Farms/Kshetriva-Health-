'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Award, Zap } from 'lucide-react';
import { Card } from '../common/Card';

interface WaterProgressRingProps {
  currentMl: number;
  targetMl: number;
}

export const WaterProgressRing: React.FC<WaterProgressRingProps> = ({
  currentMl,
  targetMl,
}) => {
  const remainingMl = Math.max(0, targetMl - currentMl);
  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));

  const size = 190;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Droplet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Daily Hydration Progress</h3>
            <p className="text-[11px] text-slate-400">Fluid balance & cellular hydration</p>
          </div>
        </div>

        <span className="text-xs font-extrabold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" /> {percentage}% Goal
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 z-10 relative">
        {/* SVG Circular Ring */}
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
              stroke="url(#waterRingGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="waterRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
              {(currentMl / 1000).toFixed(2)}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
              Liters ({currentMl} ml)
            </span>
          </div>
        </div>

        {/* Goal & Remaining Summary */}
        <div className="w-full sm:w-auto space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Daily Goal Target</p>
              <p className="text-base font-bold text-slate-200">
                {(targetMl / 1000).toFixed(1)} L ({targetMl} ml)
              </p>
            </div>
            <div className="w-2 h-8 rounded-full bg-slate-700" />
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold text-cyan-400 uppercase">Water Needed</p>
              <p className="text-lg font-extrabold text-cyan-300">
                {(remainingMl / 1000).toFixed(2)} L ({remainingMl} ml)
              </p>
            </div>
            <div className="w-2 h-8 rounded-full bg-cyan-500" />
          </div>
        </div>
      </div>
    </Card>
  );
};
