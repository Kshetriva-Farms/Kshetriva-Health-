'use client';

import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { FarmRecipe } from '../../domain/entities/Recipe';
import { Clock, Flame, Check, Plus, Award, Utensils } from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: FarmRecipe | null;
  isOpen: boolean;
  onClose: () => void;
  onLogMeal: (recipe: FarmRecipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onLogMeal,
}) => {
  if (!recipe) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe.title}>
      <div className="space-y-5">
        {/* Banner Summary */}
        <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4" /> {recipe.estimatedCalories} kcal
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
            </span>
          </div>

          <Badge variant="emerald">{recipe.difficulty}</Badge>
        </div>

        {/* Health Benefits */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" /> Key Health & Metabolic Benefits
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {recipe.healthBenefits.map((benefit, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium"
              >
                ✓ {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* Ingredients Checklist */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Ingredients Checklist ({recipe.ingredients.length})
          </h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="text-slate-200 font-medium">
                  {ing.name} {ing.isFromFarmBasket && <span className="text-[10px] text-emerald-400 font-bold">🌾 Farm Fresh</span>}
                </span>
                <span className="text-slate-400 font-semibold">{ing.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step by Step Cooking Instructions */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Cooking Instructions
          </h4>
          <div className="space-y-2">
            {recipe.instructions.map((step, idx) => (
              <div key={idx} className="flex gap-2.5 text-xs leading-relaxed text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-800">
          <Button
            variant="primary"
            onClick={() => {
              onLogMeal(recipe);
              onClose();
            }}
            className="w-full py-2.5"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Log {recipe.estimatedCalories} kcal to Calorie Tracker
          </Button>
        </div>
      </div>
    </Modal>
  );
};
