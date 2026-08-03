'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { CalorieRingWidget } from '../../components/dashboard/CalorieRingWidget';
import { MacroBreakdownWidget } from '../../components/dashboard/MacroBreakdownWidget';
import { WaterIntakeWidget } from '../../components/dashboard/WaterIntakeWidget';
import { WeightBmiWidget } from '../../components/dashboard/WeightBmiWidget';
import { VegetableBasketWidget } from '../../components/dashboard/VegetableBasketWidget';
import { ExerciseProgressWidget } from '../../components/dashboard/ExerciseProgressWidget';
import { RecentMealsWidget, MealLogItem } from '../../components/dashboard/RecentMealsWidget';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../application/context/ToastContext';
import { Plus, ShieldCheck, Activity, Sparkles, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // State values for live interactive dashboard
  const [targetCalories] = useState(2000);
  const [consumedCalories, setConsumedCalories] = useState(1420);

  const [protein, setProtein] = useState({ consumed: 85, target: 120 });
  const [carbs, setCarbs] = useState({ consumed: 140, target: 210 });
  const [fat, setFat] = useState({ consumed: 45, target: 65 });

  const [waterMl, setWaterMl] = useState(2250);
  const [targetWaterMl] = useState(3000);

  const [weightKg, setWeightKg] = useState(68.5);
  const [producePortions, setProducePortions] = useState(4);

  const [activeMinutes, setActiveMinutes] = useState(45);
  const [targetMinutes] = useState(60);
  const [caloriesBurned, setCaloriesBurned] = useState(340);

  const [meals, setMeals] = useState<MealLogItem[]>([
    {
      id: 'm1',
      type: 'Breakfast',
      title: 'Organic Berry Oatmeal & Chia Seeds',
      calories: 380,
      time: '08:30 AM',
      protein: 14,
      carbs: 58,
      fat: 8,
    },
    {
      id: 'm2',
      type: 'Lunch',
      title: 'Farm Spinach Salad & Grilled Salmon',
      calories: 560,
      time: '01:15 PM',
      protein: 42,
      carbs: 24,
      fat: 22,
    },
    {
      id: 'm3',
      type: 'Snack',
      title: 'Avocado Toast & Red Bell Peppers',
      calories: 280,
      time: '04:45 PM',
      protein: 8,
      carbs: 28,
      fat: 14,
    },
  ]);

  const handleAddWater = (addedMl: number) => {
    setWaterMl((prev) => prev + addedMl);
    showToast(`Added +${addedMl}ml water!`, 'success');
  };

  const handleAddMeal = (newMeal: Omit<MealLogItem, 'id'>) => {
    const mealItem: MealLogItem = {
      ...newMeal,
      id: `m-${Date.now()}`,
    };
    setMeals((prev) => [mealItem, ...prev]);
    setConsumedCalories((prev) => prev + mealItem.calories);
    setProtein((prev) => ({ ...prev, consumed: prev.consumed + mealItem.protein }));
    setCarbs((prev) => ({ ...prev, consumed: prev.consumed + mealItem.carbs }));
    setFat((prev) => ({ ...prev, consumed: prev.consumed + mealItem.fat }));
    showToast(`Logged "${mealItem.title}" (+${mealItem.calories} kcal)`, 'success');
  };

  const handleAddWeight = (newWeight: number) => {
    setWeightKg(newWeight);
    showToast(`Updated weight to ${newWeight} kg`, 'info');
  };

  const handleAddExercise = (mins: number, cals: number) => {
    setActiveMinutes((prev) => prev + mins);
    setCaloriesBurned((prev) => prev + cals);
    showToast(`Logged +${mins} min workout (+${cals} kcal burned)`, 'success');
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <ProtectedRoute fallbackMessage="Subscribers receive unlimited daily vitals & organic produce tracking access.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Side Navigation (Desktop) */}
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
                  Apple Health Aesthetic Mode
                </Badge>
                <Badge variant="teal">
                  <Activity className="w-3.5 h-3.5 mr-1 inline" />
                  Live Sync
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Good day,{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  {user?.displayName || user?.name || 'Subscriber'}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {currentDateFormatted} •
                Here is your health breakdown today
              </p>
            </div>

            {/* Quick Add Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="glass"
                onClick={() => handleAddWater(250)}
                className="text-xs gap-1.5 py-2.5"
              >
                +250ml Water
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsQuickAddOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="text-xs py-2.5 shadow-emerald-900/40"
              >
                Quick Add Entry
              </Button>
            </div>
          </motion.div>

          {/* Top Row: Calories Ring & Macro Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              <CalorieRingWidget consumed={consumedCalories} target={targetCalories} />
            </div>
            <MacroBreakdownWidget protein={protein} carbs={carbs} fat={fat} />
          </motion.div>

          {/* Middle Row: Water Intake & Weight/BMI */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <WaterIntakeWidget
              currentMl={waterMl}
              targetMl={targetWaterMl}
              onAddWater={handleAddWater}
            />
            <WeightBmiWidget weightKg={weightKg} heightCm={175} />
          </motion.div>

          {/* Bottom Row: Vegetable Basket, Exercise Progress & Recent Meals */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <VegetableBasketWidget
                loggedPortions={producePortions}
                targetPortions={5}
                onUpdatePortions={(val) => setProducePortions(val)}
              />
              <ExerciseProgressWidget
                activeMinutes={activeMinutes}
                targetMinutes={targetMinutes}
                caloriesBurned={caloriesBurned}
              />
            </div>

            <RecentMealsWidget
              meals={meals}
              onAddMealClick={() => setIsQuickAddOpen(true)}
            />
          </motion.div>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <BottomNav onQuickAddOpen={() => setIsQuickAddOpen(true)} />

        {/* Quick Add Logging Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddWater={handleAddWater}
          onAddMeal={handleAddMeal}
          onAddWeight={handleAddWeight}
          onAddExercise={handleAddExercise}
        />
      </div>
    </ProtectedRoute>
  );
}
