'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { WaterProgressRing } from '../../components/water-tracker/WaterProgressRing';
import { QuickAddButtons } from '../../components/water-tracker/QuickAddButtons';
import { WaterHistoryTimeline } from '../../components/water-tracker/WaterHistoryTimeline';
import { WaterReminderCard } from '../../components/water-tracker/WaterReminderCard';
import { WaterCharts, WeeklyWaterPoint } from '../../components/water-tracker/WaterCharts';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../application/context/ToastContext';
import { WaterLogEntry } from '../../domain/entities/WaterLog';
import { waterTrackerRepository } from '../../infrastructure/repositories/WaterTrackerRepository';
import {
  Droplet,
  Bell,
  BarChart2,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function WaterTrackerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'daily' | 'history' | 'charts' | 'reminders'>('daily');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const [targetWaterMl, setTargetWaterMl] = useState(3000);
  const [entries, setEntries] = useState<WaterLogEntry[]>([
    { id: 'w1', amountMl: 500, loggedAt: '08:30 AM', timestamp: new Date().toISOString() },
    { id: 'w2', amountMl: 250, loggedAt: '10:15 AM', timestamp: new Date().toISOString() },
    { id: 'w3', amountMl: 500, loggedAt: '01:00 PM', timestamp: new Date().toISOString() },
    { id: 'w4', amountMl: 750, loggedAt: '04:20 PM', timestamp: new Date().toISOString() },
  ]);

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user?.uid || user?.id) {
      const uid = user.uid || user.id || '';
      if (user.waterGoalMl) setTargetWaterMl(user.waterGoalMl);

      waterTrackerRepository.getDailyLog(uid, todayDate).then((log) => {
        if (log && log.entries) {
          setEntries(log.entries);
        }
      });
    }
  }, [user, todayDate]);

  const handleAddWater = async (amountMl: number) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const entryInput = {
      amountMl,
      loggedAt: timeStr,
      timestamp: new Date().toISOString(),
    };

    const uid = user?.uid || user?.id || 'guest';
    try {
      const updatedLog = await waterTrackerRepository.addWaterEntry(uid, todayDate, entryInput);
      setEntries(updatedLog.entries);
      showToast(`Added +${amountMl}ml water!`, 'success');
    } catch (error) {
      // Local fallback
      const localEntry: WaterLogEntry = {
        ...entryInput,
        id: `w-${Date.now()}`,
      };
      setEntries((prev) => [localEntry, ...prev]);
      showToast(`Added +${amountMl}ml water (offline mode).`, 'info');
    }
  };

  const handleRemoveEntry = async (entryId: string) => {
    const uid = user?.uid || user?.id || 'guest';
    try {
      const updatedLog = await waterTrackerRepository.removeWaterEntry(uid, todayDate, entryId);
      setEntries(updatedLog.entries);
      showToast('Water log entry removed.', 'info');
    } catch (error) {
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      showToast('Entry removed locally.', 'info');
    }
  };

  const totalWaterMl = entries.reduce((acc, e) => acc + e.amountMl, 0);

  // 7-Day Hydration Data
  const weeklyData: WeeklyWaterPoint[] = [
    { dayLabel: 'Mon', date: '2026-07-22', amountMl: 2800, targetMl: 3000 },
    { dayLabel: 'Tue', date: '2026-07-23', amountMl: 3200, targetMl: 3000 },
    { dayLabel: 'Wed', date: '2026-07-24', amountMl: 3000, targetMl: 3000 },
    { dayLabel: 'Thu', date: '2026-07-25', amountMl: 2750, targetMl: 3000 },
    { dayLabel: 'Fri', date: '2026-07-26', amountMl: 3100, targetMl: 3000 },
    { dayLabel: 'Sat', date: '2026-07-27', amountMl: 3300, targetMl: 3000 },
    { dayLabel: 'Sun', date: '2026-07-28', amountMl: totalWaterMl, targetMl: targetWaterMl },
  ];

  return (
    <ProtectedRoute fallbackMessage="Subscribers receive complete water tracking, reminder alerts & hydration trend analytics.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
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
                  <Droplet className="w-3.5 h-3.5 mr-1 inline" />
                  Hydration Tracker
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Water & Hydration Tracker
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Monitor daily fluid volume, schedule smart reminders & track hydration trends
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="glass"
                onClick={() => handleAddWater(250)}
                className="text-xs py-2.5 px-4 text-cyan-400"
              >
                +250ml Glass
              </Button>
              <Button
                variant="primary"
                onClick={() => handleAddWater(500)}
                leftIcon={<Droplet className="w-4 h-4" />}
                className="text-xs py-2.5 px-4 shadow-cyan-900/40 bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                +500ml Bottle
              </Button>
            </div>
          </motion.div>

          {/* View Tab Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-x-auto">
              <button
                onClick={() => setActiveTab('daily')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'daily'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Droplet className="w-4 h-4" /> Daily Progress
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" /> Intake History
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'charts'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart2 className="w-4 h-4" /> Hydration Charts
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'reminders'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bell className="w-4 h-4" /> Reminders
              </button>
            </div>
          </div>

          {/* View 1: Daily Progress */}
          {activeTab === 'daily' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <WaterProgressRing currentMl={totalWaterMl} targetMl={targetWaterMl} />
              <QuickAddButtons onAddWater={handleAddWater} />
              <WaterHistoryTimeline entries={entries} onRemoveEntry={handleRemoveEntry} />
            </motion.div>
          )}

          {/* View 2: History Timeline */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WaterHistoryTimeline entries={entries} onRemoveEntry={handleRemoveEntry} />
            </motion.div>
          )}

          {/* View 3: Hydration Charts */}
          {activeTab === 'charts' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WaterCharts weeklyData={weeklyData} />
            </motion.div>
          )}

          {/* View 4: Reminders Settings */}
          {activeTab === 'reminders' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WaterReminderCard />
            </motion.div>
          )}
        </main>

        {/* Bottom Navigation (Mobile) */}
        <BottomNav onQuickAddOpen={() => setIsQuickAddOpen(true)} />

        {/* Quick Add Logging Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddWater={handleAddWater}
          onAddMeal={() => {}}
          onAddWeight={() => {}}
          onAddExercise={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
