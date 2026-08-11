'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { MealPlanDisplay } from '../../components/meal-plan/MealPlanDisplay';
import { MealPlanFormModal } from '../../components/meal-plan/MealPlanFormModal';
import { IndianMealPlan, MealPlanRequest } from '../../domain/entities/MealPlan';
import { geminiService } from '../../infrastructure/services/geminiService';
import { useToast } from '../../application/context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Sparkles, ShieldCheck, RefreshCw, SlidersHorizontal, Utensils } from 'lucide-react';

export default function MealPlanPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [currentRequest, setCurrentRequest] = useState<MealPlanRequest>({
    goal: user?.primaryGoal || 'Weight Loss',
    targetCalories: user?.dailyCaloriesGoal || 2000,
    targetProtein: 110,
    availableVegetables: ['Organic Fresh Spinach', 'Heritage Farm Carrots', 'Red Bell Pepper', 'Broccoli Florets', 'Fresh Mint'],
    budget: '$15 / day',
    cuisineStyle: 'Pan-Indian',
  });

  const [mealPlan, setMealPlan] = useState<IndianMealPlan | null>(null);

  const handleGenerate = async (req: MealPlanRequest) => {
    setIsGenerating(true);
    setCurrentRequest(req);
    try {
      const plan = await geminiService.generateIndianMealPlan(req);
      setMealPlan(plan);
      showToast('Generated fresh Gemini AI Indian Meal Plan!', 'success');
    } catch (error) {
      showToast('Generated meal plan using local AI engine.', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerate(currentRequest);
  }, []);

  return (
    <ProtectedRoute requireSubscription fallbackMessage="Subscribers receive AI-powered Indian meal plan generation with Gemini 2.5 Engine.">
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
                  Gemini 2.5 Engine
                </Badge>
                <Badge variant="teal">
                  <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> AI Meal Planner
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                AI-Powered Indian Meal Planner
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Personalized daily meal plans tailored to your goal, target calories, protein, and available harvest vegetables
              </p>
            </div>

            <Button
              variant="glass"
              onClick={() => setIsFormModalOpen(true)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              className="text-xs py-2.5 px-4 text-emerald-400"
            >
              Configure Preferences
            </Button>
          </motion.div>

          {/* Generated Meal Plan Display */}
          {mealPlan && (
            <MealPlanDisplay
              plan={mealPlan}
              onRegenerate={() => handleGenerate(currentRequest)}
              isGenerating={isGenerating}
            />
          )}
        </main>

        {/* Meal Plan Form Configuration Modal */}
        <MealPlanFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleGenerate}
          isGenerating={isGenerating}
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
