'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Droplets, Plus, RotateCcw, CheckCircle2 } from 'lucide-react';

interface HydrationLoggerProps {
  currentMl: number;
  targetMl: number;
  onUpdateWater: (newMl: number) => void;
}

export const HydrationLogger: React.FC<HydrationLoggerProps> = ({
  currentMl,
  targetMl,
  onUpdateWater,
}) => {
  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));
  const isGoalReached = currentMl >= targetMl;

  return (
    <Card className="space-y-6 border-sky-500/20 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-500 shadow-md">
            <Droplets className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <Badge variant="blue">Daily Hydration Log</Badge>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              Water & Fluid Balance
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-sky-600 dark:text-sky-400">
            {currentMl}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            / {targetMl} ml
          </span>
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="space-y-2">
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden p-0.5 border border-sky-500/10">
          <div
            className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-500">{percentage}% Goal Achieved</span>
          {isGoalReached && (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Optimal Cellular Hydration Met!
            </span>
          )}
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="glass"
          size="sm"
          onClick={() => onUpdateWater(currentMl + 250)}
          className="gap-1.5 py-3"
        >
          <Plus className="w-4 h-4 text-sky-500" />
          250 ml Glass
        </Button>
        <Button
          variant="glass"
          size="sm"
          onClick={() => onUpdateWater(currentMl + 500)}
          className="gap-1.5 py-3"
        >
          <Plus className="w-4 h-4 text-sky-500" />
          500 ml Bottle
        </Button>
        <Button
          variant="glass"
          size="sm"
          onClick={() => onUpdateWater(currentMl + 1000)}
          className="gap-1.5 py-3"
        >
          <Plus className="w-4 h-4 text-sky-500" />
          1000 ml Jug
        </Button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onUpdateWater(0)}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset Water Log
        </button>
      </div>
    </Card>
  );
};
