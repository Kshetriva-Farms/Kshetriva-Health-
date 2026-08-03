'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { AuthCard } from '../../../components/auth/AuthCard';
import { useAuth } from '../../../application/context/AuthContext';
import { User as UserIcon, Heart, Salad, Activity, ArrowRight, Check } from 'lucide-react';
import { APP_ROUTES } from '../../../lib/constants/routes';

export default function ProfileCreationPage() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || user?.name || '');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Heart Health']);
  const [selectedDiet, setSelectedDiet] = useState<string[]>(['Low-Carb']);
  const [targetCalories, setTargetCalories] = useState<number>(2000);
  const [loading, setLoading] = useState<boolean>(false);

  const goalOptions = [
    'Heart Health',
    'Metabolic Energy',
    'Blood Sugar Balance',
    'Weight Management',
    'Cellular Longevity',
    'Gut Microbiome',
  ];

  const dietOptions = [
    'Low-Carb',
    'Keto',
    'Diabetic-Friendly',
    'High-Protein',
    'Vegan',
    'Mediterranean',
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleDiet = (diet: string) => {
    setSelectedDiet((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile({
        displayName: displayName || 'Health Member',
        healthGoals: selectedGoals,
        dietaryRestrictions: selectedDiet,
      });
      router.push(APP_ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Failed to save profile details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Complete Your Health Profile"
      subtitle="Tailor your Kshetriva Health+ dashboard and Gemini AI Advisor recommendations to your personal wellness goals"
    >
      <form onSubmit={handleCompleteProfile} className="space-y-6">
        <Input
          label="Display Name"
          type="text"
          placeholder="How should we address you?"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          leftIcon={<UserIcon className="w-4 h-4" />}
          required
        />

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Primary Health Goals
          </label>
          <div className="grid grid-cols-2 gap-2">
            {goalOptions.map((goal) => {
              const isSelected = selectedGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{goal}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Salad className="w-3.5 h-3.5 text-emerald-400" /> Dietary Preferences
          </label>
          <div className="grid grid-cols-2 gap-2">
            {dietOptions.map((diet) => {
              const isSelected = selectedDiet.includes(diet);
              return (
                <button
                  key={diet}
                  type="button"
                  onClick={() => toggleDiet(diet)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{diet}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> Target Daily Calories
            </span>
            <span className="text-emerald-400 font-bold">{targetCalories} kcal</span>
          </label>
          <input
            type="range"
            min="1200"
            max="4000"
            step="50"
            value={targetCalories}
            onChange={(e) => setTargetCalories(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <Button variant="primary" type="submit" isLoading={loading} className="w-full py-3">
          Save Profile & Open Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </form>
    </AuthCard>
  );
}
