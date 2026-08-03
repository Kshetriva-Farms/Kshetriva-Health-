'use client';

import React from 'react';
import { Clock, Flame, Dumbbell, Heart, Bookmark, Share2, Eye, Plus, Sparkles, Utensils } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { FarmRecipe } from '../../domain/entities/Recipe';

interface IndianRecipeCardProps {
  recipe: FarmRecipe;
  isFavorite: boolean;
  isSaved: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onToggleSave: (recipeId: string) => void;
  onShare: (recipe: FarmRecipe) => void;
  onViewDetails: (recipe: FarmRecipe) => void;
  onLogToCalorieTracker: (recipe: FarmRecipe) => void;
}

export const IndianRecipeCard: React.FC<IndianRecipeCardProps> = ({
  recipe,
  isFavorite,
  isSaved,
  onToggleFavorite,
  onToggleSave,
  onShare,
  onViewDetails,
  onLogToCalorieTracker,
}) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl flex flex-col hover:border-emerald-500/40 transition-all group">
      {/* Recipe Header Image Banner */}
      <div className="relative h-48 bg-slate-800 overflow-hidden">
        {recipe.imageUrl && !imgError ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-emerald-950 via-teal-900 to-amber-900 flex items-center justify-center text-emerald-300 font-extrabold text-lg p-4 text-center">
            {recipe.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap max-w-[75%]">
          <Badge variant="emerald">
            🇮🇳 {recipe.category}
          </Badge>
          {recipe.heroProduce.length > 0 && (
            <Badge variant="teal">
              🌾 {recipe.heroProduce[0]}
            </Badge>
          )}
        </div>

        {/* Action Controls (Favorite & Save) */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(recipe.id)}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-slate-900/70 text-slate-300 hover:text-rose-400'
            }`}
            title={isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={() => onToggleSave(recipe.id)}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              isSaved
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900/70 text-slate-300 hover:text-amber-400'
            }`}
            title={isSaved ? 'Saved Recipe' : 'Save Recipe'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
          </button>
        </div>

        {/* Bottom Energy Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-xs font-extrabold text-amber-400 flex items-center gap-1 shadow-md">
          <Flame className="w-3.5 h-3.5" /> {recipe.estimatedCalories} kcal
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins cook time
            </span>
            <span className="font-semibold text-emerald-400">
              {recipe.servingSize || `${recipe.servings} Servings`}
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
            {recipe.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          {/* Basket Produce Highlight */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Uses Harvest Basket: {recipe.heroProduce.join(', ')}</span>
          </div>
        </div>

        {/* Macro Summary */}
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

        {/* Card Action Controls */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => onViewDetails(recipe)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Preparation
          </button>

          <button
            onClick={() => onShare(recipe)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors border border-slate-700"
            title="Share Recipe"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onLogToCalorieTracker(recipe)}
            className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
            title="Log to today's meal tracker"
          >
            <Plus className="w-3.5 h-3.5" /> Log
          </button>
        </div>
      </div>
    </Card>
  );
};
