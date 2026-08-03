'use client';

import React from 'react';
import { Droplet, Clock, Trash2 } from 'lucide-react';
import { Card } from '../common/Card';
import { WaterLogEntry } from '../../domain/entities/WaterLog';

interface WaterHistoryTimelineProps {
  entries: WaterLogEntry[];
  onRemoveEntry: (id: string) => void;
}

export const WaterHistoryTimeline: React.FC<WaterHistoryTimelineProps> = ({
  entries,
  onRemoveEntry,
}) => {
  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Today&apos;s Intake History</h3>
            <p className="text-[11px] text-slate-400">Timeline of recorded fluid entries</p>
          </div>
        </div>

        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
          {entries.length} Logged Entries
        </span>
      </div>

      <div className="space-y-2.5 pt-1 max-h-72 overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No water intake logged yet today. Tap a Quick Add button above to log your first drink!
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30 shrink-0">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">+{entry.amountMl} ml</h4>
                  <p className="text-[10px] text-slate-400">
                    Recorded at {entry.loggedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-cyan-300">
                  {(entry.amountMl / 1000).toFixed(2)} L
                </span>
                <button
                  onClick={() => onRemoveEntry(entry.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-80 hover:opacity-100"
                  title="Delete log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
