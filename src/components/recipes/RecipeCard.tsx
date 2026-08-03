'use client';

import React from 'react';
import { Clock, Flame, Dumbbell, Wheat, Droplets, Plus, Eye, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { FarmRecipe } from '../../domain/entities/Recipe';

interface RecipeCardProps {
  recipe: FarmRecipe;
  onViewDetails: (recipe: FarmRecipe) => void;
  onLogToCalorieTracker: (recipe: FarmRecipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onViewDetails,
  onLogToCalorieTracker,
}) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl flex flex-col hover:border-slate-700 transition-all group">
      {/* Recipe Header Banner */}
      <div className="relative h-44 bg-slate-800 overflow-hidden">
        {recipe.imageUrl && !imgError ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-emerald-900 to-teal-800 flex items-center justify-center text-emerald-300 font-extrabold text-lg p-4 text-center">
            {recipe.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="emerald">{recipe.category}</Badge>
          {recipe.isSubscriberExclusive && (
            <Badge variant="teal">
              <Sparkles className="w-3 h-3 mr-1 inline" /> Premium Recipe
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 text-xs font-bold text-amber-400 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> {recipe.estimatedCalories} kcal
        </div>
      </div>

      {/* Recipe Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins total
            </span>
            <span className="font-semibold text-slate-300">{recipe.difficulty}</span>
          </div>

          <h3 className="text-base font-extrabold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
            {recipe.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          {/* Hero Produce Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {recipe.heroProduce.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-semibold"
              >
                🌾 {item}
              </span>
            ))}
          </div>
        </div>

        {/* Macro Summary Split */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-800/40 border border-slate-800 text-center">
          <div>
            <p className="text-[9px] font-semibold text-rose-400 uppercase">Protein</p>
            <p className="text-xs font-extrabold text-slate-200">{recipe.macros.protein}g</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold text-cyan-400 uppercase">Carbs</p>
            <p className="text-xs font-extrabold text-slate-200">{recipe.macros.carbs}g</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold text-amber-400 uppercase">Fat</p>
            <p className="text-xs font-extrabold text-slate-200">{recipe.macros.fat}g</p>
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => onViewDetails(recipe)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> View Recipe
          </button>
          <button
            onClick={() => onLogToCalorieTracker(recipe)}
            className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
            title="Log calories to today's meal tracker"
          >
            <Plus className="w-3.5 h-3.5" /> Log Meal
          </button>
        </div>
      </div>
    </Card>
  );
};
