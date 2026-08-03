'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../application/context/ToastContext';
import {
  User as UserIcon,
  Scale,
  Activity,
  Target,
  Flame,
  Droplet,
  Save,
  ShieldCheck,
  Calculator,
  UserCheck,
} from 'lucide-react';
import { ActivityLevel, HealthGoalType } from '../../domain/entities/User';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State initialized from User context
  const [displayName, setDisplayName] = useState(user?.displayName || user?.name || '');
  const [age, setAge] = useState<string>(user?.age ? String(user.age) : '28');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>(
    user?.gender || 'Male'
  );
  const [heightCm, setHeightCm] = useState<string>(user?.heightCm ? String(user.heightCm) : '175');
  const [weightKg, setWeightKg] = useState<string>(user?.weightKg ? String(user.weightKg) : '68.5');
  const [targetWeightKg, setTargetWeightKg] = useState<string>(
    user?.targetWeightKg ? String(user.targetWeightKg) : '65'
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    user?.activityLevel || 'Moderately Active'
  );
  const [primaryGoal, setPrimaryGoal] = useState<HealthGoalType>(
    user?.primaryGoal || 'Maintain Weight'
  );
  const [dailyCalories, setDailyCalories] = useState<string>(
    user?.dailyCaloriesGoal ? String(user.dailyCaloriesGoal) : '2000'
  );
  const [waterGoal, setWaterGoal] = useState<string>(
    user?.waterGoalMl ? String(user.waterGoalMl) : '3000'
  );

  useEffect(() => {
    if (user) {
      if (user.displayName || user.name) setDisplayName(user.displayName || user.name || '');
      if (user.age) setAge(String(user.age));
      if (user.gender) setGender(user.gender);
      if (user.heightCm) setHeightCm(String(user.heightCm));
      if (user.weightKg) setWeightKg(String(user.weightKg));
      if (user.targetWeightKg) setTargetWeightKg(String(user.targetWeightKg));
      if (user.activityLevel) setActivityLevel(user.activityLevel);
      if (user.primaryGoal) setPrimaryGoal(user.primaryGoal);
      if (user.dailyCaloriesGoal) setDailyCalories(String(user.dailyCaloriesGoal));
      if (user.waterGoalMl) setWaterGoal(String(user.waterGoalMl));
    }
  }, [user]);

  // Auto-Calculate Recommended Daily Calories (Mifflin-St Jeor Formula)
  const handleAutoCalculateCalories = () => {
    const w = parseFloat(weightKg) || 70;
    const h = parseFloat(heightCm) || 170;
    const a = parseFloat(age) || 30;

    // BMR Base
    let bmr = 10 * w + 6.25 * h - 5 * a + (gender === 'Female' ? -161 : 5);

    // Activity Multiplier
    const multipliers: Record<ActivityLevel, number> = {
      Sedentary: 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725,
    };
    let tdee = bmr * (multipliers[activityLevel] || 1.55);

    // Goal Adjustments
    if (primaryGoal === 'Weight Loss') tdee -= 400;
    if (primaryGoal === 'Muscle Gain') tdee += 350;

    const calculated = Math.round(tdee);
    setDailyCalories(String(calculated));
    showToast(`Recommended daily calories set to ${calculated} kcal`, 'info');
  };

  // Auto-Calculate Recommended Water Goal (Weight * 35ml)
  const handleAutoCalculateWater = () => {
    const w = parseFloat(weightKg) || 70;
    const calculated = Math.round(w * 35);
    setWaterGoal(String(calculated));
    showToast(`Recommended water goal set to ${calculated} ml (${(calculated / 1000).toFixed(1)} L)`, 'info');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName,
        name: displayName,
        age: parseInt(age, 10) || 28,
        gender,
        heightCm: parseFloat(heightCm) || 175,
        weightKg: parseFloat(weightKg) || 68.5,
        targetWeightKg: parseFloat(targetWeightKg) || 65,
        activityLevel,
        primaryGoal,
        dailyCaloriesGoal: parseInt(dailyCalories, 10) || 2000,
        waterGoalMl: parseInt(waterGoal, 10) || 3000,
      });
      showToast('Profile and health targets saved to Firestore!', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const activityOptions: ActivityLevel[] = [
    'Sedentary',
    'Lightly Active',
    'Moderately Active',
    'Very Active',
  ];

  const goalOptions: HealthGoalType[] = [
    'Weight Loss',
    'Muscle Gain',
    'Maintain Weight',
  ];

  return (
    <ProtectedRoute fallbackMessage="Please sign in to access and edit your personal health profile.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Desktop Sidebar Navigation */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 pt-8 pb-24 max-w-5xl mx-auto space-y-8 overflow-x-hidden">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-emerald-900/30 shrink-0 border-2 border-emerald-400/40">
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="emerald">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 inline text-emerald-400" />
                    Firestore Sync Active
                  </Badge>
                  <Badge variant="teal">Editable Anytime</Badge>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                  {displayName || 'User Profile'}
                </h1>
                <p className="text-xs text-slate-400">
                  {user?.email || 'subscriber@kshetriva.com'}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleSaveProfile}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="py-3 px-6 text-xs shadow-emerald-900/40"
            >
              Save Profile Changes
            </Button>
          </motion.div>

          {/* Profile Editor Form */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Section 1: Basic Information */}
            <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <UserIcon className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-100">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  required
                />

                <Input
                  label="Age (Years)"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="28"
                  required
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Section 2: Body & Physical Metrics */}
            <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Scale className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-bold text-slate-100">Body & Weight Metrics</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Height (cm)"
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="175"
                  required
                />

                <Input
                  label="Current Weight (kg)"
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="68.5"
                  required
                />

                <Input
                  label="Target Weight (kg)"
                  type="number"
                  step="0.1"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(e.target.value)}
                  placeholder="65"
                  required
                />
              </div>
            </Card>

            {/* Section 3: Health Goal & Activity Level */}
            <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Target className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-slate-100">Fitness Goals & Activity Level</h2>
              </div>

              {/* Goal Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Primary Health Goal</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {goalOptions.map((goal) => {
                    const isSelected = primaryGoal === goal;
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setPrimaryGoal(goal)}
                        className={`p-3.5 rounded-2xl text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/50 text-emerald-300 shadow-md'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activity Level Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Daily Activity Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activityOptions.map((act) => {
                    const isSelected = activityLevel === act;
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => setActivityLevel(act)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                        }`}
                      >
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Section 4: Calculated Daily Goals */}
            <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Flame className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-slate-100">Daily Energy & Hydration Targets</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> Daily Calories Goal (kcal)
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoCalculateCalories}
                      className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
                    >
                      <Calculator className="w-3 h-3" /> Auto-Calculate BMR
                    </button>
                  </div>
                  <Input
                    type="number"
                    value={dailyCalories}
                    onChange={(e) => setDailyCalories(e.target.value)}
                    placeholder="2000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-blue-400" /> Water Intake Goal (ml)
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoCalculateWater}
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
                    >
                      <Calculator className="w-3 h-3" /> Auto-Calculate
                    </button>
                  </div>
                  <Input
                    type="number"
                    value={waterGoal}
                    onChange={(e) => setWaterGoal(e.target.value)}
                    placeholder="3000"
                    required
                  />
                </div>
              </div>
            </Card>

            <div className="pt-2">
              <Button
                variant="primary"
                type="submit"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
                className="w-full py-3 text-sm shadow-emerald-900/40"
              >
                Save Profile & Persist to Firestore
              </Button>
            </div>
          </form>
        </main>

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
