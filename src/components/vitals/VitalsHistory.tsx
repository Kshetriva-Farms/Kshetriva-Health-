'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Calendar, Droplets, Leaf, Flame } from 'lucide-react';

export const VitalsHistory: React.FC = () => {
  const historyLogs = [
    { date: 'Yesterday (July 23)', water: '2,750 ml', portions: '5 / 5', calories: '1,820 kcal', status: 'Optimal' },
    { date: 'July 22', water: '3,000 ml', portions: '5 / 5', calories: '1,950 kcal', status: 'Optimal' },
    { date: 'July 21', water: '2,250 ml', portions: '4 / 5', calories: '1,680 kcal', status: 'Good' },
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-500" />
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
            Recent Vital Logs History
          </h3>
        </div>
        <Badge variant="emerald">7-Day Trend</Badge>
      </div>

      <div className="space-y-3">
        {historyLogs.map((log, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {log.date}
            </span>

            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                {log.water}
              </span>
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                {log.portions}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                {log.calories}
              </span>
            </div>

            <Badge variant={log.status === 'Optimal' ? 'emerald' : 'amber'}>
              {log.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
