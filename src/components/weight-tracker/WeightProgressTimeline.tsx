'use client';

import React from 'react';
import { Scale, Trash2, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Card } from '../common/Card';
import { WeightLogEntry } from '../../domain/entities/WeightLog';

interface WeightProgressTimelineProps {
  entries: WeightLogEntry[];
  onRemoveEntry: (id: string) => void;
}

export const WeightProgressTimeline: React.FC<WeightProgressTimelineProps> = ({
  entries,
  onRemoveEntry,
}) => {
  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Weight Log History</h3>
            <p className="text-[11px] text-slate-400">Timeline of body weight & composition logs</p>
          </div>
        </div>

        <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
          {entries.length} History Logs
        </span>
      </div>

      <div className="space-y-2.5 pt-1 max-h-72 overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No weight entries logged yet. Click &quot;Log Weight Reading&quot; to record your weight!
          </div>
        ) : (
          entries.map((entry, idx) => {
            const prev = entries[idx + 1];
            let delta = 0;
            if (prev) {
              delta = Math.round((entry.weightKg - prev.weightKg) * 10) / 10;
            }

            return (
              <div
                key={entry.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30 shrink-0 font-extrabold text-xs">
                    {entry.weightKg}kg
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-200">
                        {entry.weightKg} kg ({ (entry.weightKg * 2.20462).toFixed(1) } lbs)
                      </h4>
                      {delta !== 0 && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                            delta < 0
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {delta < 0 ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
                          {delta > 0 ? `+${delta}` : delta} kg
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Logged on {entry.loggedAt} • BMI: {entry.bmi} {entry.bodyFatPct && `• Fat: ${entry.bodyFatPct}%`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {entry.notes && (
                    <span className="hidden sm:inline text-[10px] text-slate-400 italic">
                      &quot;{entry.notes}&quot;
                    </span>
                  )}
                  <button
                    onClick={() => onRemoveEntry(entry.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-80 hover:opacity-100"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
