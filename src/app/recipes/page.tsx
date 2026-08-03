'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { IndianRecipeCard } from '../../components/recipes/IndianRecipeCard';
import { RecipeDetailModal } from '../../components/recipes/RecipeDetailModal';
import { ShareRecipeModal } from '../../components/recipes/ShareRecipeModal';
import { PRESET_RECIPE_DATABASE } from '../../lib/constants/recipeDatabase';
import { FarmRecipe } from '../../domain/entities/Recipe';
import { calorieTrackerRepository } from '../../infrastructure/repositories/CalorieTrackerRepository';
import { useToast } from '../../application/context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Search, ShieldCheck, Sparkles, Heart, Bookmark, Utensils } from 'lucide-react';

export default function RecipesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'indian' | 'global' | 'favorites'>('indian');

  const [selectedRecipe, setSelectedRecipe] = useState<FarmRecipe | null>(null);
  const [shareRecipe, setShareRecipe] = useState<FarmRecipe | null>(null);

  const [favoriteIds, setFavoriteIds] = useState<string[]>(['ind-1', 'ind-3']);
  const [savedIds, setSavedIds] = useState<string[]>(['ind-1', 'ind-3']);

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Removed from Favorites.' : 'Added to Favorite Recipes! ❤️', 'info');
      return updated;
    });
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Removed from Saved Recipes.' : 'Recipe Saved! 🔖', 'info');
      return updated;
    });
  };

  const filteredRecipes = PRESET_RECIPE_DATABASE.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'indian') {
      return matchesSearch && recipe.cuisine === 'Indian';
    }
    if (activeTab === 'global') {
      return matchesSearch && recipe.cuisine === 'Global';
    }
    if (activeTab === 'favorites') {
      return matchesSearch && (favoriteIds.includes(recipe.id) || savedIds.includes(recipe.id));
    }
    return matchesSearch;
  });

  const handleLogRecipe = async (recipe: FarmRecipe) => {
    const uid = user?.uid || user?.id || 'guest';
    const todayDate = new Date().toISOString().split('T')[0];

    try {
      await calorieTrackerRepository.logMealItem(uid, todayDate, {
        id: `recipe-${Date.now()}`,
        name: recipe.title,
        mealCategory: recipe.category === 'Smoothie' || recipe.category === 'Salad' ? 'Lunch' : 'Dinner',
        quantity: 1,
        unit: `${recipe.servings} serving`,
        calories: recipe.estimatedCalories,
        protein: recipe.macros.protein,
        carbs: recipe.macros.carbs,
        fat: recipe.macros.fat,
        loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      showToast(`Logged "${recipe.title}" (+${recipe.estimatedCalories} kcal) to today's meal log!`, 'success');
    } catch (error) {
      showToast(`Recipe logged locally (+${recipe.estimatedCalories} kcal).`, 'info');
    }
  };

  return (
    <ProtectedRoute fallbackMessage="Subscribers get unlimited access to bioactive farm harvest recipes & instant calorie logging.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Sidebar Navigation (Desktop) */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 pt-8 pb-24 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="emerald">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline text-emerald-400" />
                  Farm-to-Table Kitchen
                </Badge>
                <Badge variant="teal">
                  <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> Customer Harvest Basket
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Indian & Global Farm Harvest Recipes
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Recipes crafted directly using vegetables from your current Kshetriva harvest basket (Spinach, Carrots, Peppers, Broccoli, Mint)
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search Palak, Gajar, Kadai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </motion.div>

          {/* View Tab Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-x-auto">
              <button
                onClick={() => setActiveTab('indian')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'indian'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🇮🇳 Indian Farm Basket Recipes
              </button>
              <button
                onClick={() => setActiveTab('global')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'global'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌍 Global Health Recipes
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'favorites'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ❤️ Saved & Favorites ({favoriteIds.length})
              </button>
            </div>
          </div>

          {/* Recipe Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <IndianRecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favoriteIds.includes(recipe.id)}
                isSaved={savedIds.includes(recipe.id)}
                onToggleFavorite={handleToggleFavorite}
                onToggleSave={handleToggleSave}
                onShare={(r) => setShareRecipe(r)}
                onViewDetails={(r) => setSelectedRecipe(r)}
                onLogToCalorieTracker={handleLogRecipe}
              />
            ))}
          </div>
        </main>

        {/* Recipe Detail Preparation Modal */}
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onLogMeal={handleLogRecipe}
        />

        {/* Share Recipe Modal */}
        <ShareRecipeModal
          recipe={shareRecipe}
          isOpen={!!shareRecipe}
          onClose={() => setShareRecipe(null)}
        />

        {/* Bottom Navigation (Mobile) */}
        <BottomNav onQuickAddOpen={() => setIsQuickAddOpen(true)} />

        {/* Quick Add Logging Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddWater={() => {}}
          onAddMeal={() => {}}
          onAddWeight={() => {}}
          onAddExercise={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
