'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Sun, Moon, Cookie, RefreshCw, ShoppingCart, Award, Flame, Dumbbell, Sparkles, Check } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { IndianMealPlan, MealPlanMeal } from '../../domain/entities/MealPlan';

interface MealPlanDisplayProps {
  plan: IndianMealPlan;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({
  plan,
  onRegenerate,
  isGenerating,
}) => {
  const mealList: { category: string; meal: MealPlanMeal; icon: React.ReactNode; color: string }[] = [
    { category: 'Breakfast', meal: plan.meals.breakfast, icon: <Coffee className="w-4 h-4 text-amber-400" />, color: 'border-amber-500/30' },
    { category: 'Lunch', meal: plan.meals.lunch, icon: <Sun className="w-4 h-4 text-emerald-400" />, color: 'border-emerald-500/30' },
    { category: 'Snacks', meal: plan.meals.snacks, icon: <Cookie className="w-4 h-4 text-pink-400" />, color: 'border-pink-500/30' },
    { category: 'Dinner', meal: plan.meals.dinner, icon: <Moon className="w-4 h-4 text-indigo-400" />, color: 'border-indigo-500/30' },
  ];

  return (
    <div className="space-y-8">
      {/* Plan Header Summary */}
      <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald">
              <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> Gemini 2.5 AI Generated
            </Badge>
            <Badge variant="amber">Goal: {plan.goal}</Badge>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100">
            Personalized Indian Meal Plan ({plan.totalCalories} kcal)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimized for {plan.totalProtein}g protein & crafted with your harvest basket produce
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onRegenerate}
          isLoading={isGenerating}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="py-2.5 px-5 text-xs shadow-emerald-900/40"
        >
          Regenerate Plan
        </Button>
      </Card>

      {/* 4 Meal Cards Grid (Breakfast, Lunch, Snacks, Dinner) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mealList.map(({ category, meal, icon, color }) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className={`p-5 bg-slate-900/80 border ${color} backdrop-blur-xl rounded-3xl shadow-xl space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{category}</h3>
                    <p className="text-[10px] text-slate-400">{meal.prepTimeMinutes} mins prep</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-amber-400">{meal.calories} kcal</span>
                  <p className="text-[9px] font-semibold text-slate-400">P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">{meal.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{meal.description}</p>
              </div>

              {/* Ingredients List */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ingredients</span>
                <div className="flex flex-wrap gap-1">
                  {meal.ingredients.map((ing, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                      • {ing}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom Grid: Nutritional Summary & Shopping Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nutritional Summary */}
        <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">Bioactive Nutritional Summary</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-semibold text-emerald-400 uppercase">Fiber</span>
              <p className="text-base font-extrabold text-emerald-200">{plan.nutritionalSummary.fiberG}g</p>
            </div>
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20">
              <span className="text-[10px] font-semibold text-teal-400 uppercase">Vitamin C</span>
              <p className="text-base font-extrabold text-teal-200">{plan.nutritionalSummary.vitCMg}mg</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] font-semibold text-amber-400 uppercase">Iron</span>
              <p className="text-base font-extrabold text-amber-200">{plan.nutritionalSummary.ironMg}mg</p>
            </div>
          </div>
        </Card>

        {/* Shopping Suggestions */}
        <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShoppingCart className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Shopping List Suggestions</h3>
          </div>

          <div className="space-y-2">
            {plan.shoppingSuggestions.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">🛒 {item}</span>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
