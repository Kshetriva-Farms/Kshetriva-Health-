'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { WeightStatsCard } from '../../components/weight-tracker/WeightStatsCard';
import { LogWeightModal } from '../../components/weight-tracker/LogWeightModal';
import { WeightGraph } from '../../components/weight-tracker/WeightGraph';
import { WeightProgressTimeline } from '../../components/weight-tracker/WeightProgressTimeline';
import { WeightLogEntry, WeightTrackerProfile } from '../../domain/entities/WeightLog';
import { weightTrackerRepository, calculateBMI } from '../../infrastructure/repositories/WeightTrackerRepository';
import { useToast } from '../../application/context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Scale, Plus, ShieldCheck, TrendingDown, Award } from 'lucide-react';

export default function WeightTrackerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const [currentWeightKg, setCurrentWeightKg] = useState(68.5);
  const [targetWeightKg, setTargetWeightKg] = useState(65);
  const [heightCm, setHeightCm] = useState(175);
  const [bodyFatPct, setBodyFatPct] = useState(18.5);

  const [entries, setEntries] = useState<WeightLogEntry[]>([
    { id: 'wgt-1', weightKg: 68.5, bodyFatPct: 18.5, bmi: 22.4, loggedAt: '2026-07-28 Today', timestamp: new Date().toISOString() },
    { id: 'wgt-2', weightKg: 69.1, bodyFatPct: 18.8, bmi: 22.6, loggedAt: '2026-07-21', timestamp: new Date().toISOString() },
    { id: 'wgt-3', weightKg: 69.8, bodyFatPct: 19.0, bmi: 22.8, loggedAt: '2026-07-14', timestamp: new Date().toISOString() },
    { id: 'wgt-4', weightKg: 70.5, bodyFatPct: 19.4, bmi: 23.0, loggedAt: '2026-07-07', timestamp: new Date().toISOString() },
  ]);

  useEffect(() => {
    if (user?.uid || user?.id) {
      const uid = user.uid || user.id || '';
      if (user.weightKg) setCurrentWeightKg(user.weightKg);
      if (user.targetWeightKg) setTargetWeightKg(user.targetWeightKg);
      if (user.heightCm) setHeightCm(user.heightCm);

      weightTrackerRepository.getWeightProfile(uid).then((profile) => {
        if (profile && profile.entries && profile.entries.length > 0) {
          setEntries(profile.entries);
          setCurrentWeightKg(profile.currentWeightKg);
        }
      });
    }
  }, [user]);

  const { bmi, category } = calculateBMI(currentWeightKg, heightCm);

  const handleLogWeight = async (wKg: number, bfPct?: number, notes?: string) => {
    const timeStr = new Date().toISOString().split('T')[0] + ' Today';

    const uid = user?.uid || user?.id || 'guest';
    try {
      const updatedProfile = await weightTrackerRepository.logWeightEntry(
        uid,
        { weightKg: wKg, bodyFatPct: bfPct, loggedAt: timeStr, timestamp: new Date().toISOString(), notes },
        heightCm,
        targetWeightKg
      );

      setEntries(updatedProfile.entries);
      setCurrentWeightKg(updatedProfile.currentWeightKg);
      if (bfPct) setBodyFatPct(bfPct);
      showToast(`Logged weight reading ${wKg} kg!`, 'success');
    } catch (error) {
      const { bmi: calcBmi } = calculateBMI(wKg, heightCm);
      const localEntry: WeightLogEntry = {
        id: `wgt-${Date.now()}`,
        weightKg: wKg,
        bodyFatPct: bfPct,
        bmi: calcBmi,
        loggedAt: timeStr,
        timestamp: new Date().toISOString(),
        notes,
      };

      setEntries((prev) => [localEntry, ...prev]);
      setCurrentWeightKg(wKg);
      if (bfPct) setBodyFatPct(bfPct);
      showToast(`Logged ${wKg} kg (offline mode).`, 'info');
    }
  };

  const handleRemoveEntry = async (entryId: string) => {
    const uid = user?.uid || user?.id || 'guest';
    try {
      const updatedProfile = await weightTrackerRepository.removeWeightEntry(uid, entryId);
      setEntries(updatedProfile.entries);
      setCurrentWeightKg(updatedProfile.currentWeightKg);
      showToast('Weight entry removed.', 'info');
    } catch (error) {
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      showToast('Entry removed locally.', 'info');
    }
  };

  return (
    <ProtectedRoute fallbackMessage="Subscribers receive complete weight trajectory tracking, BMI indicators & Firestore sync.">
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
                  Firestore Sync Active
                </Badge>
                <Badge variant="teal">
                  <Scale className="w-3.5 h-3.5 mr-1 inline" /> Weight & Body Fat Tracker
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Weight & Body Composition Tracker
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Track body weight trajectory, BMI score category & body fat percentage goals
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setIsLogModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs py-2.5 px-4 shadow-emerald-900/40"
            >
              Log Weight Reading
            </Button>
          </motion.div>

          {/* Metric Stats Cards Grid */}
          <WeightStatsCard
            currentWeightKg={currentWeightKg}
            targetWeightKg={targetWeightKg}
            bmi={bmi}
            bmiCategory={category}
            bodyFatPct={bodyFatPct}
          />

          {/* Interactive Weight Graph Chart */}
          <WeightGraph entries={entries} targetWeightKg={targetWeightKg} />

          {/* Log History Timeline */}
          <WeightProgressTimeline entries={entries} onRemoveEntry={handleRemoveEntry} />
        </main>

        {/* Log Weight Reading Modal */}
        <LogWeightModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onLogWeight={handleLogWeight}
        />

        {/* Bottom Navigation (Mobile) */}
        <BottomNav onQuickAddOpen={() => setIsQuickAddOpen(true)} />

        {/* Quick Add Logging Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddWater={() => {}}
          onAddMeal={() => {}}
          onAddWeight={(w) => handleLogWeight(w)}
          onAddExercise={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
