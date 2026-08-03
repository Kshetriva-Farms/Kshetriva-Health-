'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { DailyProgressCircle } from '../../components/calorie-tracker/DailyProgressCircle';
import { MealSectionCard } from '../../components/calorie-tracker/MealSectionCard';
import { FoodSearchModal } from '../../components/calorie-tracker/FoodSearchModal';
import { ManualFoodEntryModal } from '../../components/calorie-tracker/ManualFoodEntryModal';
import { WeeklyCalorieChart, DailyDataPoint } from '../../components/calorie-tracker/WeeklyCalorieChart';
import { MonthlyCalorieChart, MonthlyWeekPoint } from '../../components/calorie-tracker/MonthlyCalorieChart';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../application/context/ToastContext';
import { LoggedMealItem, MealCategory } from '../../domain/entities/FoodItem';
import { calorieTrackerRepository } from '../../infrastructure/repositories/CalorieTrackerRepository';
import {
  Flame,
  Search,
  Plus,
  Calendar,
  BarChart2,
  PieChart,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function CalorieTrackerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedMealCategory, setSelectedMealCategory] = useState<MealCategory>('Breakfast');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const [targetCalories, setTargetCalories] = useState(2000);
  const [loggedItems, setLoggedItems] = useState<LoggedMealItem[]>([
    {
      id: 'l1',
      name: 'Rolled Oats & Organic Berries',
      mealCategory: 'Breakfast',
      quantity: 1,
      unit: '1 bowl',
      calories: 320,
      protein: 12,
      carbs: 54,
      fat: 6,
      loggedAt: '08:15 AM',
    },
    {
      id: 'l2',
      name: 'Grilled Salmon & Spinach Salad',
      mealCategory: 'Lunch',
      quantity: 1,
      unit: '1 plate',
      calories: 540,
      protein: 44,
      carbs: 18,
      fat: 22,
      loggedAt: '01:30 PM',
    },
    {
      id: 'l3',
      name: 'Raw Almonds & Chia Pudding',
      mealCategory: 'Snacks',
      quantity: 1,
      unit: '1 oz',
      calories: 220,
      protein: 7,
      carbs: 16,
      fat: 12,
      loggedAt: '04:45 PM',
    },
  ]);

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user?.uid || user?.id) {
      const uid = user.uid || user.id || '';
      if (user.dailyCaloriesGoal) setTargetCalories(user.dailyCaloriesGoal);

      calorieTrackerRepository.getDailyLog(uid, todayDate).then((log) => {
        if (log && log.loggedItems) {
          setLoggedItems(log.loggedItems);
        }
      });
    }
  }, [user, todayDate]);

  const handleAddFood = async (item: LoggedMealItem) => {
    const updated = [item, ...loggedItems];
    setLoggedItems(updated);

    const uid = user?.uid || user?.id || 'guest';
    try {
      await calorieTrackerRepository.logMealItem(uid, todayDate, item);
      showToast(`Logged "${item.name}" (+${item.calories} kcal) to ${item.mealCategory}`, 'success');
    } catch (error) {
      showToast('Food logged locally (offline mode).', 'info');
    }
  };

  const handleRemoveFood = async (itemId: string) => {
    const updated = loggedItems.filter((i) => i.id !== itemId);
    setLoggedItems(updated);

    const uid = user?.uid || user?.id || 'guest';
    try {
      await calorieTrackerRepository.removeMealItem(uid, todayDate, itemId);
      showToast('Item removed from log.', 'info');
    } catch (error) {
      showToast('Item removed locally.', 'info');
    }
  };

  // Aggregated totals
  const totalCalories = loggedItems.reduce((acc, i) => acc + i.calories, 0);
  const totalProtein = loggedItems.reduce((acc, i) => acc + i.protein, 0);
  const totalCarbs = loggedItems.reduce((acc, i) => acc + i.carbs, 0);
  const totalFat = loggedItems.reduce((acc, i) => acc + i.fat, 0);

  // Filter items by category
  const breakfastItems = loggedItems.filter((i) => i.mealCategory === 'Breakfast');
  const lunchItems = loggedItems.filter((i) => i.mealCategory === 'Lunch');
  const dinnerItems = loggedItems.filter((i) => i.mealCategory === 'Dinner');
  const snacksItems = loggedItems.filter((i) => i.mealCategory === 'Snacks');

  // Dummy 7-Day & 30-Day Data
  const weeklyData: DailyDataPoint[] = [
    { dayLabel: 'Mon', date: '2026-07-22', calories: 1850, target: 2000 },
    { dayLabel: 'Tue', date: '2026-07-23', calories: 1940, target: 2000 },
    { dayLabel: 'Wed', date: '2026-07-24', calories: 2050, target: 2000 },
    { dayLabel: 'Thu', date: '2026-07-25', calories: 1780, target: 2000 },
    { dayLabel: 'Fri', date: '2026-07-26', calories: 1990, target: 2000 },
    { dayLabel: 'Sat', date: '2026-07-27', calories: 2120, target: 2000 },
    { dayLabel: 'Sun', date: '2026-07-28', calories: totalCalories, target: targetCalories },
  ];

  const monthlyWeeks: MonthlyWeekPoint[] = [
    { weekLabel: 'Week 1', avgCalories: 1890, onTargetDays: 6 },
    { weekLabel: 'Week 2', avgCalories: 1950, onTargetDays: 5 },
    { weekLabel: 'Week 3', avgCalories: 2010, onTargetDays: 6 },
    { weekLabel: 'Week 4', avgCalories: 1920, onTargetDays: 7 },
  ];

  return (
    <ProtectedRoute fallbackMessage="Subscribers get full access to food database search, macro split tracking & historical charts.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Sidebar Nav (Desktop) */}
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
                  Firestore Sync Active
                </Badge>
                <Badge variant="amber">
                  <Flame className="w-3.5 h-3.5 mr-1 inline" />
                  Calorie & Macro Tracker
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Calorie & Nutrition Tracker
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Log meals, search organic farm foods, and monitor daily macro goals
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="glass"
                onClick={() => setIsManualEntryOpen(true)}
                className="text-xs py-2.5 px-4 text-emerald-400"
              >
                + Custom Entry
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedMealCategory('Lunch');
                  setIsSearchOpen(true);
                }}
                leftIcon={<Search className="w-4 h-4" />}
                className="text-xs py-2.5 px-4 shadow-emerald-900/40"
              >
                Search Food Database
              </Button>
            </div>
          </motion.div>

          {/* View Tab Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <button
                onClick={() => setActiveTab('daily')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'daily'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PieChart className="w-4 h-4" /> Daily Tracker
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'weekly'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart2 className="w-4 h-4" /> 7-Day Weekly Chart
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'monthly'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" /> 30-Day Monthly Chart
              </button>
            </div>
          </div>

          {/* View 1: Daily Tracker */}
          {activeTab === 'daily' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Daily Progress Circle Card */}
              <DailyProgressCircle
                consumedCalories={totalCalories}
                targetCalories={targetCalories}
                totalProtein={totalProtein}
                totalCarbs={totalCarbs}
                totalFat={totalFat}
              />

              {/* Meal Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MealSectionCard
                  category="Breakfast"
                  items={breakfastItems}
                  onOpenSearch={(cat) => {
                    setSelectedMealCategory(cat);
                    setIsSearchOpen(true);
                  }}
                  onRemoveItem={handleRemoveFood}
                />

                <MealSectionCard
                  category="Lunch"
                  items={lunchItems}
                  onOpenSearch={(cat) => {
                    setSelectedMealCategory(cat);
                    setIsSearchOpen(true);
                  }}
                  onRemoveItem={handleRemoveFood}
                />

                <MealSectionCard
                  category="Dinner"
                  items={dinnerItems}
                  onOpenSearch={(cat) => {
                    setSelectedMealCategory(cat);
                    setIsSearchOpen(true);
                  }}
                  onRemoveItem={handleRemoveFood}
                />

                <MealSectionCard
                  category="Snacks"
                  items={snacksItems}
                  onOpenSearch={(cat) => {
                    setSelectedMealCategory(cat);
                    setIsSearchOpen(true);
                  }}
                  onRemoveItem={handleRemoveFood}
                />
              </div>
            </motion.div>
          )}

          {/* View 2: Weekly Analytics Chart */}
          {activeTab === 'weekly' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WeeklyCalorieChart data={weeklyData} />
            </motion.div>
          )}

          {/* View 3: Monthly Analytics Chart */}
          {activeTab === 'monthly' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <MonthlyCalorieChart weeks={monthlyWeeks} />
            </motion.div>
          )}
        </main>

        {/* Bottom Navigation (Mobile) */}
        <BottomNav onQuickAddOpen={() => setIsQuickAddOpen(true)} />

        {/* Food Search Modal */}
        <FoodSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          targetMealCategory={selectedMealCategory}
          onAddFood={handleAddFood}
          onOpenManualEntry={() => setIsManualEntryOpen(true)}
        />

        {/* Manual Custom Entry Modal */}
        <ManualFoodEntryModal
          isOpen={isManualEntryOpen}
          onClose={() => setIsManualEntryOpen(false)}
          defaultMealCategory={selectedMealCategory}
          onAddFood={handleAddFood}
        />

        {/* Quick Add Logging Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddWater={() => {}}
          onAddMeal={(m) => {
            const cat: MealCategory =
              m.type === 'Breakfast'
                ? 'Breakfast'
                : m.type === 'Lunch'
                ? 'Lunch'
                : m.type === 'Dinner'
                ? 'Dinner'
                : 'Snacks';

            handleAddFood({
              id: `m-${Date.now()}`,
              name: m.title,
              mealCategory: cat,
              quantity: 1,
              unit: 'serving',
              calories: m.calories,
              protein: m.protein,
              carbs: m.carbs,
              fat: m.fat,
              loggedAt: m.time,
            });
          }}
          onAddWeight={() => {}}
          onAddExercise={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
