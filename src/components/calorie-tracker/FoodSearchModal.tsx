'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PRESET_FOOD_DATABASE } from '../../lib/constants/foodDatabase';
import { FoodItem, MealCategory, LoggedMealItem } from '../../domain/entities/FoodItem';
import { Search, Plus, Sparkles, Check } from 'lucide-react';

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMealCategory: MealCategory;
  onAddFood: (item: LoggedMealItem) => void;
  onOpenManualEntry: () => void;
}

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  isOpen,
  onClose,
  targetMealCategory,
  onAddFood,
  onOpenManualEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quantityMultiplier, setQuantityMultiplier] = useState<number>(1);

  const categories = ['All', 'Vegetables', 'Proteins', 'Grains', 'Fruits', 'Nuts & Seeds'];

  const filteredFoods = PRESET_FOOD_DATABASE.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSelectFood = (food: FoodItem) => {
    const loggedItem: LoggedMealItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      foodId: food.id,
      name: food.name,
      mealCategory: targetMealCategory,
      quantity: quantityMultiplier,
      unit: food.servingSize,
      calories: Math.round(food.calories * quantityMultiplier),
      protein: Math.round(food.protein * quantityMultiplier * 10) / 10,
      carbs: Math.round(food.carbs * quantityMultiplier * 10) / 10,
      fat: Math.round(food.fat * quantityMultiplier * 10) / 10,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onAddFood(loggedItem);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Food to ${targetMealCategory}`}>
      <div className="space-y-4">
        {/* Search Bar & Switcher */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search organic spinach, salmon, oats, eggs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quantity Selection Bar */}
        <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-300">Portion Quantity:</span>
          <div className="flex items-center gap-1">
            {[0.5, 1, 1.5, 2].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantityMultiplier(q)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  quantityMultiplier === q
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {q}x
              </button>
            ))}
          </div>
        </div>

        {/* Search Results List */}
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {filteredFoods.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No matching foods found. Try searching another term or add custom item.
            </div>
          ) : (
            filteredFoods.map((food) => {
              const scaledCals = Math.round(food.calories * quantityMultiplier);
              const scaledP = Math.round(food.protein * quantityMultiplier * 10) / 10;
              const scaledC = Math.round(food.carbs * quantityMultiplier * 10) / 10;
              const scaledF = Math.round(food.fat * quantityMultiplier * 10) / 10;

              return (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                      {food.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {food.servingSize} • P:{scaledP}g C:{scaledC}g F:{scaledF}g
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-amber-400">
                      +{scaledCals} kcal
                    </span>
                    <button className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Trigger for Manual Custom Entry */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">Can&apos;t find your food item?</span>
          <Button
            variant="glass"
            onClick={() => {
              onClose();
              onOpenManualEntry();
            }}
            className="text-xs py-1.5 px-3 gap-1 text-emerald-400"
          >
            <Sparkles className="w-3.5 h-3.5" /> Manual Custom Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
};
