'use client';

import React from 'react';
import { OrganicRecipe } from '@/lib/constants/recipesData';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Clock, ChefHat, Flame, Leaf, Sparkles, ArrowRight } from 'lucide-react';

interface RecipeCardGridProps {
  recipes: OrganicRecipe[];
  onSelectRecipe: (recipe: OrganicRecipe) => void;
}

export const RecipeCardGrid: React.FC<RecipeCardGridProps> = ({ recipes, onSelectRecipe }) => {
  if (recipes.length === 0) {
    return (
      <Card className="text-center py-12 space-y-3">
        <p className="text-slate-500 font-medium">No farm recipes matched your query.</p>
        <p className="text-xs text-slate-400">Try adjusting your produce search or category filter.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          className="space-y-4 hover:border-brand-500/40 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-3">
            
            {/* Header badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{recipe.icon}</span>
                <Badge variant="emerald">{recipe.category}</Badge>
              </div>
              <Badge variant="amber" icon={<Sparkles className="w-3 h-3" />}>
                {recipe.healthTarget}
              </Badge>
            </div>

            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-emerald-400 transition-colors">
                {recipe.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {recipe.subtitle}
              </p>
            </div>

            {/* Farm produce tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {recipe.primaryHarvestProduce.map((prod, idx) => (
                <Badge key={idx} variant="slate" icon={<Leaf className="w-3 h-3 text-emerald-500" />}>
                  {prod}
                </Badge>
              ))}
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                {recipe.prepTimeMinutes} mins
              </span>
              <span className="flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                {recipe.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                {recipe.caloriesPerServing} kcal
              </span>
            </div>

            <Button
              variant="glass"
              size="sm"
              onClick={() => onSelectRecipe(recipe)}
              className="w-full gap-2 py-2.5"
            >
              View Full Recipe & Bioactives <ArrowRight className="w-3.5 h-3.5 text-brand-500" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
