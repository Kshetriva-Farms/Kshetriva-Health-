'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Sparkles, Activity, ShieldAlert, Heart, Flame } from 'lucide-react';

interface HealthGoalOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HEALTH_GOALS: HealthGoalOption[] = [
  {
    id: 'gut-microbiome',
    title: 'Gut Microbiome & Digestivity',
    description: 'Optimizes soluble fiber & bioactive prebiotics from leafy greens',
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
  },
  {
    id: 'anti-inflammation',
    title: 'Cellular Anti-Inflammation',
    description: 'High polyphenols & lycopene to reduce systemic tissue stress',
    icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: 'cardiovascular',
    title: 'Heart & Vascular Strength',
    description: 'Rich in dietary nitrates, potassium & antioxidants',
    icon: <Heart className="w-5 h-5 text-rose-500" />,
  },
  {
    id: 'metabolic-energy',
    title: 'Sustained Metabolic Energy',
    description: 'Low-glycemic slow carbs & enzymatic cofactor activation',
    icon: <Flame className="w-5 h-5 text-orange-500" />,
  },
];

interface HealthGoalPickerProps {
  selectedGoalId: string;
  onSelectGoal: (goal: string) => void;
}

export const HealthGoalPicker: React.FC<HealthGoalPickerProps> = ({
  selectedGoalId,
  onSelectGoal,
}) => {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <Activity className="w-4 h-4 text-amber-500" />
        Select Your Primary Health & Vitality Focus:
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {HEALTH_GOALS.map((goal) => {
          const isSelected = selectedGoalId === goal.title;
          return (
            <Card
              key={goal.id}
              onClick={() => onSelectGoal(goal.title)}
              className={`cursor-pointer p-4 flex items-start gap-3 transition-all duration-200 ${
                isSelected
                  ? 'border-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 shadow-md scale-[1.01]'
                  : 'hover:border-amber-500/30'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                {goal.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {goal.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {goal.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
