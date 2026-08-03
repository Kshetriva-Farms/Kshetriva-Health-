'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MealPlanRequest } from '../../domain/entities/MealPlan';
import { Sparkles, Check, Flame, Dumbbell, DollarSign, Utensils } from 'lucide-react';

interface MealPlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: MealPlanRequest) => void;
  isGenerating: boolean;
}

export const MealPlanFormModal: React.FC<MealPlanFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGenerating,
}) => {
  const [goal, setGoal] = useState<'Weight Loss' | 'Muscle Gain' | 'Maintain Weight'>('Weight Loss');
  const [targetCalories, setTargetCalories] = useState('2000');
  const [targetProtein, setTargetProtein] = useState('110');
  const [budget, setBudget] = useState('$15 / day');
  const [cuisineStyle, setCuisineStyle] = useState<'Pan-Indian' | 'North Indian' | 'South Indian'>('Pan-Indian');

  const [availableVegetables, setAvailableVegetables] = useState<string[]>([
    'Organic Fresh Spinach',
    'Heritage Farm Carrots',
    'Red Bell Pepper',
    'Broccoli Florets',
    'Fresh Mint',
  ]);

  const toggleVeggie = (veg: string) => {
    setAvailableVegetables((prev) =>
      prev.includes(veg) ? prev.filter((v) => v !== veg) : [...prev, veg]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      goal,
      targetCalories: parseInt(targetCalories, 10) || 2000,
      targetProtein: parseInt(targetProtein, 10) || 110,
      availableVegetables,
      budget,
      cuisineStyle,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure AI Indian Meal Plan">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Selector */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Health Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="Weight Loss">Weight Loss (Caloric Deficit)</option>
            <option value="Muscle Gain">Muscle Gain (High Protein)</option>
            <option value="Maintain Weight">Maintain Weight & Vitality</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Daily Calories (kcal)"
            type="number"
            value={targetCalories}
            onChange={(e) => setTargetCalories(e.target.value)}
            required
          />
          <Input
            label="Target Protein (g)"
            type="number"
            value={targetProtein}
            onChange={(e) => setTargetProtein(e.target.value)}
            required
          />
        </div>

        {/* Vegetables Available Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Vegetables Available (Harvest Basket)</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Organic Fresh Spinach',
              'Heritage Farm Carrots',
              'Red Bell Pepper',
              'Broccoli Florets',
              'Fresh Mint',
              'Organic Paneer',
              'Yellow Moong Dal',
            ].map((veg) => {
              const isSelected = availableVegetables.includes(veg);
              return (
                <button
                  key={veg}
                  type="button"
                  onClick={() => toggleVeggie(veg)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {veg}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Daily Budget ($ or ₹)"
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Cuisine Style</label>
            <select
              value={cuisineStyle}
              onChange={(e) => setCuisineStyle(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="Pan-Indian">Pan-Indian Bioactive</option>
              <option value="North Indian">North Indian Desi</option>
              <option value="South Indian">South Indian Spiced</option>
            </select>
          </div>
        </div>

        <Button variant="primary" type="submit" isLoading={isGenerating} className="w-full py-2.5">
          <Sparkles className="w-4 h-4 mr-1.5" /> Generate Gemini AI Meal Plan
        </Button>
      </form>
    </Modal>
  );
};
