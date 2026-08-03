'use client';

import React from 'react';
import { Utensils, Coffee, Sun, Moon, Cookie, Plus } from 'lucide-react';
import { Card } from '../common/Card';

export interface MealLogItem {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  title: string;
  calories: number;
  time: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface RecentMealsWidgetProps {
  meals: MealLogItem[];
  onAddMealClick: () => void;
}

export const RecentMealsWidget: React.FC<RecentMealsWidgetProps> = ({
  meals,
  onAddMealClick,
}) => {
  const getMealIcon = (type: MealLogItem['type']) => {
    switch (type) {
      case 'Breakfast':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'Lunch':
        return <Sun className="w-4 h-4 text-emerald-400" />;
      case 'Dinner':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'Snack':
        return <Cookie className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Recent Meals Log</h3>
            <p className="text-[11px] text-slate-400">Today&apos;s nutritional intake</p>
          </div>
        </div>

        <button
          onClick={onAddMealClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" /> Log Meal
        </button>
      </div>

      <div className="space-y-3 pt-1">
        {meals.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No meals logged yet today. Click &quot;Log Meal&quot; to add your first entry!
          </div>
        ) : (
          meals.map((meal) => (
            <div
              key={meal.id}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                  {getMealIcon(meal.type)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{meal.title}</h4>
                  <p className="text-[10px] text-slate-400">
                    {meal.type} • {meal.time}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-amber-400">
                  +{meal.calories} kcal
                </span>
                <p className="text-[9px] text-slate-400 font-medium">
                  P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
