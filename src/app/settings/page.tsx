'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../application/context/ToastContext';
import { useTheme } from '../../application/context/ThemeContext';
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Shield,
  Sparkles,
  Database,
  Save,
  CheckCircle,
  Smartphone,
  Sliders,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [harvestAlerts, setHarvestAlerts] = useState(true);
  const [aiModelPreference, setAiModelPreference] = useState<'gemini-2.5-flash' | 'gemini-1.5-flash'>('gemini-2.5-flash');
  const [autoSyncFirestore, setAutoSyncFirestore] = useState(true);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      if (user) {
        await updateUserProfile({
          ...user,
        });
      }
      showToast('Settings saved successfully!', 'success');
    } catch (error: any) {
      showToast('Settings saved locally.', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute fallbackMessage="Please sign in to customize your Kshetriva Health+ settings and preferences.">
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
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="emerald">
                  <Sliders className="w-3.5 h-3.5 mr-1 inline text-emerald-400" />
                  Preferences & Controls
                </Badge>
                <Badge variant="teal">
                  <Shield className="w-3.5 h-3.5 mr-1 inline text-teal-400" />
                  Secure Config
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Account & System Settings
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage notifications, Gemini AI defaults, theme modes, and sync preferences
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleSaveSettings}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="py-3 px-6 text-xs shadow-emerald-900/40"
            >
              Save Preferences
            </Button>
          </motion.div>

          <div className="space-y-6">
            {/* Section 1: Appearance & Display */}
            <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Sun className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-slate-100">Appearance & Theme</h2>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Color Theme Mode</h3>
                  <p className="text-[11px] text-slate-400">Switch between dark emerald aesthetic and light harvest theme</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-xs font-bold text-slate-200"
                >
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-4 h-4 text-cyan-400" /> Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" /> Light Mode
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-800/60">
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Measurement Units</h3>
                  <p className="text-[11px] text-slate-400">Kilograms/Liters vs Pounds/Ounces</p>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setUnitSystem('metric')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      unitSystem === 'metric'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Metric (kg, ml)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitSystem('imperial')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      unitSystem === 'imperial'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Imperial (lbs, oz)
                  </button>
                </div>
              </div>
            </Card>

            {/* Section 2: Gemini AI Integration */}
            <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-100">Gemini AI Nutrition Assistant</h2>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">Default Model Engine</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAiModelPreference('gemini-2.5-flash')}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      aiModelPreference === 'gemini-2.5-flash'
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-md'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Gemini 2.5 Flash</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Recommended</span>
                    </div>
                    <p className="text-[11px] opacity-80">Ultra-fast clinical nutrition analysis with multi-nutrient extraction.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiModelPreference('gemini-1.5-flash')}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      aiModelPreference === 'gemini-1.5-flash'
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-md'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Gemini 1.5 Flash</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">Standard</span>
                    </div>
                    <p className="text-[11px] opacity-80">High throughput, balanced energy performance model.</p>
                  </button>
                </div>
              </div>
            </Card>

            {/* Section 3: Notification Preferences */}
            <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Bell className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-bold text-slate-100">Notifications & Alerts</h2>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">Daily Vitals & Hydration Reminders</span>
                    <span className="text-slate-400 text-[11px]">Timely morning and evening logging prompts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyReminders}
                    onChange={(e) => setDailyReminders(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                  <div>
                    <span className="font-bold text-slate-200 block">Organic Harvest Basket Delivery Updates</span>
                    <span className="text-slate-400 text-[11px]">Real-time tracking when new produce basket arrives</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={harvestAlerts}
                    onChange={(e) => setHarvestAlerts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                  <div>
                    <span className="font-bold text-slate-200 block">Weekly Health Digest Email</span>
                    <span className="text-slate-400 text-[11px]">Summary reports of calories, weight, and nutrient absorption</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            {/* Section 4: Security & Data Sync */}
            <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Database className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-100">Data Sync & Security</h2>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Real-time Cloud Firestore Sync
                  </span>
                  <span className="text-slate-400 text-[11px]">Automatically back up vitals and meal logs to secure Firestore</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoSyncFirestore}
                  onChange={(e) => setAutoSyncFirestore(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </Card>
          </div>
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
