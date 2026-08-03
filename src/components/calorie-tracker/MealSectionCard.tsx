'use client';

import React from 'react';
import { Coffee, Sun, Moon, Cookie, Plus, Trash2, Utensils } from 'lucide-react';
import { Card } from '../common/Card';
import { LoggedMealItem, MealCategory } from '../../domain/entities/FoodItem';

interface MealSectionCardProps {
  category: MealCategory;
  items: LoggedMealItem[];
  onOpenSearch: (category: MealCategory) => void;
  onRemoveItem: (itemId: string) => void;
}

export const MealSectionCard: React.FC<MealSectionCardProps> = ({
  category,
  items,
  onOpenSearch,
  onRemoveItem,
}) => {
  const sectionCalories = items.reduce((acc, i) => acc + i.calories, 0);
  const sectionProtein = items.reduce((acc, i) => acc + i.protein, 0);
  const sectionCarbs = items.reduce((acc, i) => acc + i.carbs, 0);
  const sectionFat = items.reduce((acc, i) => acc + i.fat, 0);

  const getCategoryConfig = (cat: MealCategory) => {
    switch (cat) {
      case 'Breakfast':
        return {
          icon: <Coffee className="w-4 h-4 text-amber-400" />,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/20',
          subtitle: 'Morning energy boost',
        };
      case 'Lunch':
        return {
          icon: <Sun className="w-4 h-4 text-emerald-400" />,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          subtitle: 'Midday nutrient recharge',
        };
      case 'Dinner':
        return {
          icon: <Moon className="w-4 h-4 text-indigo-400" />,
          color: 'text-indigo-400',
          bg: 'bg-indigo-500/10 border-indigo-500/20',
          subtitle: 'Evening recovery meal',
        };
      case 'Snacks':
        return {
          icon: <Cookie className="w-4 h-4 text-pink-400" />,
          color: 'text-pink-400',
          bg: 'bg-pink-500/10 border-pink-500/20',
          subtitle: 'Bioactive snacks & fruits',
        };
    }
  };

  const config = getCategoryConfig(category);

  return (
    <Card className="p-5 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${config.bg}`}>
            {config.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{category}</h3>
            <p className="text-[10px] text-slate-400">{config.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-extrabold text-amber-400">
              {sectionCalories} kcal
            </span>
            <p className="text-[9px] font-medium text-slate-400">
              P:{Math.round(sectionProtein)}g C:{Math.round(sectionCarbs)}g F:{Math.round(sectionFat)}g
            </p>
          </div>

          <button
            onClick={() => onOpenSearch(category)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Add Food
          </button>
        </div>
      </div>

      {/* Logged Items List */}
      <div className="space-y-2 pt-1">
        {items.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-2xl">
            No items logged for {category} yet. Click &quot;Add Food&quot; to log entries.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-700 shrink-0">
                  {item.quantity}x
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">
                    {item.unit} • logged at {item.loggedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400">+{item.calories} kcal</span>
                  <p className="text-[9px] text-slate-400 font-medium">
                    P:{item.protein}g C:{item.carbs}g F:{item.fat}g
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-80 hover:opacity-100"
                  title="Delete Item"
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
