'use client';

import React from 'react';
import { Search, Filter, Leaf, Sparkles } from 'lucide-react';

interface RecipeSearchFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedHealthTarget: string;
  onHealthTargetChange: (target: string) => void;
}

export const RecipeSearchFilter: React.FC<RecipeSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedHealthTarget,
  onHealthTargetChange,
}) => {
  const categories = ['All Categories', 'Soups & Broths', 'Salads & Bowls', 'Sauté & Curries', 'Smoothies & Juices'];
  const healthTargets = ['All Targets', 'Anti-Inflammation', 'Gut Microbiome', 'Heart Health', 'Metabolic Energy'];

  return (
    <div className="p-6 rounded-3xl glass-panel-light dark:glass-panel-dark border border-brand-500/20 shadow-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search recipes, ingredients (e.g. Palak)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Health Target Dropdown */}
        <div className="relative">
          <select
            value={selectedHealthTarget}
            onChange={(e) => onHealthTargetChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {healthTargets.map((target, idx) => (
              <option key={idx} value={target}>
                {target}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
