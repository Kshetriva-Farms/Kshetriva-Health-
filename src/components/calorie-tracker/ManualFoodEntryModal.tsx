'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { LoggedMealItem, MealCategory } from '../../domain/entities/FoodItem';
import { Plus } from 'lucide-react';

interface ManualFoodEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMealCategory?: MealCategory;
  onAddFood: (item: LoggedMealItem) => void;
}

export const ManualFoodEntryModal: React.FC<ManualFoodEntryModalProps> = ({
  isOpen,
  onClose,
  defaultMealCategory = 'Lunch',
  onAddFood,
}) => {
  const [name, setName] = useState('');
  const [mealCategory, setMealCategory] = useState<MealCategory>(defaultMealCategory);
  const [calories, setCalories] = useState('350');
  const [protein, setProtein] = useState('20');
  const [carbs, setCarbs] = useState('35');
  const [fat, setFat] = useState('10');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('serving');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const qty = parseFloat(quantity) || 1;

    const loggedItem: LoggedMealItem = {
      id: `manual-${Date.now()}`,
      name: name.trim(),
      mealCategory,
      quantity: qty,
      unit: unit || 'serving',
      calories: Math.round((parseFloat(calories) || 0) * qty),
      protein: Math.round((parseFloat(protein) || 0) * qty * 10) / 10,
      carbs: Math.round((parseFloat(carbs) || 0) * qty * 10) / 10,
      fat: Math.round((parseFloat(fat) || 0) * qty * 10) / 10,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onAddFood(loggedItem);
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manual Food Custom Entry">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Food Name"
          placeholder="e.g. Homemade Avocado Toast & Poached Egg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Meal Category</label>
            <select
              value={mealCategory}
              onChange={(e) => setMealCategory(e.target.value as MealCategory)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <Input
            label="Total Calories (kcal)"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Input
            label="Protein (g)"
            type="number"
            step="0.1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <Input
            label="Carbs (g)"
            type="number"
            step="0.1"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <Input
            label="Fat (g)"
            type="number"
            step="0.1"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Quantity"
            type="number"
            step="0.5"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <Input
            label="Unit / Serving"
            type="text"
            placeholder="e.g. bowl, 100g, plate"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <Button variant="primary" type="submit" className="w-full py-2.5">
          <Plus className="w-4 h-4 mr-1.5" /> Save Custom Food Entry
        </Button>
      </form>
    </Modal>
  );
};
