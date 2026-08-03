'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Droplet, Utensils, Scale, Activity, Plus } from 'lucide-react';
import { MealLogItem } from './RecentMealsWidget';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWater: (amountMl: number) => void;
  onAddMeal: (meal: Omit<MealLogItem, 'id'>) => void;
  onAddWeight: (weightKg: number) => void;
  onAddExercise: (minutes: number, calories: number) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddWater,
  onAddMeal,
  onAddWeight,
  onAddExercise,
}) => {
  const [activeTab, setActiveTab] = useState<'water' | 'meal' | 'weight' | 'exercise'>('meal');

  // Meal Form State
  const [mealTitle, setMealTitle] = useState('');
  const [mealType, setMealType] = useState<MealLogItem['type']>('Lunch');
  const [mealCalories, setMealCalories] = useState('450');
  const [mealProtein, setMealProtein] = useState('30');
  const [mealCarbs, setMealCarbs] = useState('45');
  const [mealFat, setMealFat] = useState('12');

  // Water Form State
  const [waterAmount, setWaterAmount] = useState('250');

  // Weight Form State
  const [weightVal, setWeightVal] = useState('68.5');

  // Exercise Form State
  const [exerciseMinutes, setExerciseMinutes] = useState('30');
  const [exerciseCalories, setExerciseCalories] = useState('220');

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealTitle.trim()) return;
    onAddMeal({
      type: mealType,
      title: mealTitle,
      calories: Number(mealCalories) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      protein: Number(mealProtein) || 0,
      carbs: Number(mealCarbs) || 0,
      fat: Number(mealFat) || 0,
    });
    setMealTitle('');
    onClose();
  };

  const handleWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWater(Number(waterAmount) || 250);
    onClose();
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWeight(Number(weightVal) || 68);
    onClose();
  };

  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExercise(Number(exerciseMinutes) || 30, Number(exerciseCalories) || 200);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Log Entry">
      <div className="space-y-6">
        {/* Modal Tab Switcher */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('meal')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'meal'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Meal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('water')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'water'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" /> Water
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('weight')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'weight'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> Weight
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exercise')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exercise'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Exercise
          </button>
        </div>

        {/* Meal Tab */}
        {activeTab === 'meal' && (
          <form onSubmit={handleMealSubmit} className="space-y-4">
            <Input
              label="Meal Description"
              placeholder="e.g. Organic Farm Salad with Grilled Salmon"
              value={mealTitle}
              onChange={(e) => setMealTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealLogItem['type'])}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
              <Input
                label="Calories (kcal)"
                type="number"
                value={mealCalories}
                onChange={(e) => setMealCalories(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Protein (g)"
                type="number"
                value={mealProtein}
                onChange={(e) => setMealProtein(e.target.value)}
              />
              <Input
                label="Carbs (g)"
                type="number"
                value={mealCarbs}
                onChange={(e) => setMealCarbs(e.target.value)}
              />
              <Input
                label="Fat (g)"
                type="number"
                value={mealFat}
                onChange={(e) => setMealFat(e.target.value)}
              />
            </div>
            <Button variant="primary" type="submit" className="w-full py-2.5">
              <Plus className="w-4 h-4 mr-1.5" /> Save Meal Entry
            </Button>
          </form>
        )}

        {/* Water Tab */}
        {activeTab === 'water' && (
          <form onSubmit={handleWaterSubmit} className="space-y-4">
            <Input
              label="Water Volume (ml)"
              type="number"
              value={waterAmount}
              onChange={(e) => setWaterAmount(e.target.value)}
              required
            />
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWaterAmount('250')}
                className="py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200"
              >
                250 ml (1 Glass)
              </button>
              <button
                type="button"
                onClick={() => setWaterAmount('500')}
                className="py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200"
              >
                500 ml (1 Bottle)
              </button>
              <button
                type="button"
                onClick={() => setWaterAmount('750')}
                className="py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200"
              >
                750 ml (1 Flask)
              </button>
            </div>
            <Button variant="primary" type="submit" className="w-full py-2.5">
              <Plus className="w-4 h-4 mr-1.5" /> Log Hydration
            </Button>
          </form>
        )}

        {/* Weight Tab */}
        {activeTab === 'weight' && (
          <form onSubmit={handleWeightSubmit} className="space-y-4">
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              value={weightVal}
              onChange={(e) => setWeightVal(e.target.value)}
              required
            />
            <Button variant="primary" type="submit" className="w-full py-2.5">
              <Plus className="w-4 h-4 mr-1.5" /> Save Weight Record
            </Button>
          </form>
        )}

        {/* Exercise Tab */}
        {activeTab === 'exercise' && (
          <form onSubmit={handleExerciseSubmit} className="space-y-4">
            <Input
              label="Active Duration (Minutes)"
              type="number"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(e.target.value)}
              required
            />
            <Input
              label="Estimated Calories Burned (kcal)"
              type="number"
              value={exerciseCalories}
              onChange={(e) => setExerciseCalories(e.target.value)}
              required
            />
            <Button variant="primary" type="submit" className="w-full py-2.5">
              <Plus className="w-4 h-4 mr-1.5" /> Log Workout Progress
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
