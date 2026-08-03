'use client';

import React, { useState } from 'react';
import { GeminiMealRecommendation } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Clock, ChefHat, Flame, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Leaf } from 'lucide-react';

interface MealCardProps {
  meal: GeminiMealRecommendation;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <Card className="space-y-5 border-brand-500/20 shadow-lg hover:border-brand-500/40">
      
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
              Gemini AI Recipe
            </Badge>
            <Badge variant="emerald">{meal.healthTarget}</Badge>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {meal.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-emerald-500" />
            {meal.prepTimeMinutes} mins
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="w-4 h-4 text-amber-500" />
            {meal.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-rose-500" />
            {meal.estimatedCalories} kcal
          </span>
        </div>
      </div>

      {/* Why It Benefits You Highlight */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed space-y-1">
        <p className="font-bold flex items-center gap-1.5 text-brand-700 dark:text-emerald-300">
          <Leaf className="w-4 h-4 text-emerald-500" /> Cellular Health Synergy:
        </p>
        <p>{meal.whyItBenefitsYou}</p>
      </div>

      {/* Macro Nutrients Grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Protein</span>
          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{meal.macros.protein}g</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Carbs</span>
          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{meal.macros.carbs}g</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Healthy Fats</span>
          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{meal.macros.fat}g</p>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Ingredients:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {meal.ingredients.map((ing, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl flex items-center justify-between border ${
                ing.isFromFarmBasket
                  ? 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-500/20 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="font-semibold flex items-center gap-1.5">
                {ing.isFromFarmBasket && <Leaf className="w-3.5 h-3.5 text-emerald-500" />}
                {ing.name}
              </span>
              <span className="font-mono font-medium">{ing.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions Accordion Toggle */}
      <div className="pt-2">
        <Button
          variant="glass"
          size="sm"
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full justify-between gap-2"
        >
          <span className="font-bold text-xs">
            {showInstructions ? 'Hide Preparation Steps' : 'View Step-by-Step Cooking Guide'}
          </span>
          {showInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {showInstructions && (
          <div className="mt-4 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs animate-fadeIn">
            {meal.instructions.map((step, stepIdx) => (
              <div key={stepIdx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                  {stepIdx + 1}
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </Card>
  );
};
