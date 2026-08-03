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
import { Badge } from '../../components/common/Badge';
import { notificationService } from '../../infrastructure/services/notificationService';
import {
  NotificationItem,
  NotificationPreferences,
  NotificationCategory,
} from '../../domain/entities/Notification';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Send,
  Droplet,
  Dumbbell,
  Utensils,
  Package,
  CreditCard,
  BookOpen,
  Mail,
  Smartphone,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sliders,
} from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    setPrefs(notificationService.getPreferences());
    setNotifications(notificationService.getNotifications());
  }, []);

  const handleToggleChannel = (channel: 'inAppEnabled' | 'pushEnabled' | 'emailEnabled') => {
    if (!prefs) return;
    const updated = { ...prefs, [channel]: !prefs[channel] };
    setPrefs(updated);
    notificationService.savePreferences(updated);
  };

  const handleToggleCategory = (categoryKey: keyof NotificationPreferences['categories']) => {
    if (!prefs) return;
    const updated = {
      ...prefs,
      categories: {
        ...prefs.categories,
        [categoryKey]: !prefs.categories[categoryKey],
      },
    };
    setPrefs(updated);
    notificationService.savePreferences(updated);
  };

  const handleTriggerTestNotif = (cat: NotificationCategory) => {
    const updated = notificationService.triggerTestNotification(cat);
    setNotifications(updated);
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notificationService.markAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
  };

  const handleClearAll = () => {
    const updated = notificationService.clearAll();
    setNotifications(updated);
  };

  const requestBrowserPushPermission = async () => {
    if ('Notification' in window) {
      const perm = await window.Notification.requestPermission();
      if (perm === 'granted') {
        alert('Browser Push Notifications enabled successfully!');
      } else {
        alert('Push notification permission was blocked in browser settings.');
      }
    } else {
      alert('Browser does not support HTML5 Push Notifications.');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategoryFilter === 'ALL') return true;
    return n.category === activeCategoryFilter;
  });

  if (!prefs) return null;

  return (
    <ProtectedRoute fallbackMessage="Manage your daily hydration, meal, delivery, and exercise notification settings here.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Navigation Sidebar */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 pt-8 pb-24 max-w-6xl mx-auto space-y-8 overflow-x-hidden">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 sm:p-6 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30 shrink-0">
                <Bell className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="emerald">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Real-time Notification Engine
                  </Badge>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                  Notification Center & Daily Reminders
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={handleClearAll}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-300 transition-all"
                title="Clear All Notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Test Trigger Bar */}
          <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Trigger Instant Sample Reminders:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => handleTriggerTestNotif('WATER')}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-xs font-medium text-cyan-300 flex items-center gap-1 whitespace-nowrap active:scale-95 transition-all"
              >
                <Droplet className="w-3.5 h-3.5" /> Drink Water
              </button>
              <button
                onClick={() => handleTriggerTestNotif('EXERCISE')}
                className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-xs font-medium text-emerald-300 flex items-center gap-1 whitespace-nowrap active:scale-95 transition-all"
              >
                <Dumbbell className="w-3.5 h-3.5" /> Exercise Goal
              </button>
              <button
                onClick={() => handleTriggerTestNotif('MEAL_LOG')}
                className="px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-xs font-medium text-amber-300 flex items-center gap-1 whitespace-nowrap active:scale-95 transition-all"
              >
                <Utensils className="w-3.5 h-3.5" /> Log Meals
              </button>
              <button
                onClick={() => handleTriggerTestNotif('VEGGIE_DELIVERY')}
                className="px-3 py-1.5 rounded-xl bg-teal-950/40 hover:bg-teal-900/60 border border-teal-500/30 text-xs font-medium text-teal-300 flex items-center gap-1 whitespace-nowrap active:scale-95 transition-all"
              >
                <Package className="w-3.5 h-3.5" /> Veggie Delivery
              </button>
              <button
                onClick={() => handleTriggerTestNotif('SUBSCRIPTION')}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-xs font-medium text-indigo-300 flex items-center gap-1 whitespace-nowrap active:scale-95 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" /> Subscription
              </button>
              <button
                onClick={() => handleTriggerTestNotif('RECIPE')}
                className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-xs font-medium text-rose-300 flex items-center gap-1 whitespace-nowrap active:scale-95 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" /> Recipe Alert
              </button>
            </div>
          </Card>

          {/* Grid Layout: Notification Preferences & Notifications Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Notification Channels & Reminders Configuration */}
            <div className="space-y-6 lg:col-span-1">
              {/* Notification Channels Card */}
              <Card className="p-5 space-y-4 bg-slate-900/80 border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-extrabold text-slate-100 text-sm">Delivery Channels</h3>
                </div>

                <div className="space-y-3 text-xs">
                  {/* In-App Channel */}
                  <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-slate-200 block">In-App Alerts</span>
                        <span className="text-[10px] text-slate-400">Bell widget & feed</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleChannel('inAppEnabled')}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        prefs.inAppEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          prefs.inAppEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Web Push Channel */}
                  <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-teal-400" />
                      <div>
                        <span className="font-bold text-slate-200 block">Web Push</span>
                        <span className="text-[10px] text-slate-400">Browser push notifications</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleChannel('pushEnabled')}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        prefs.pushEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          prefs.pushEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email Channel */}
                  <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="font-bold text-slate-200 block">Email Digest</span>
                        <span className="text-[10px] text-slate-400">Daily health & harvest updates</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleChannel('emailEnabled')}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        prefs.emailEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          prefs.emailEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={requestBrowserPushPermission}
                  className="w-full py-2 text-xs font-semibold text-teal-300 border-slate-700 hover:border-teal-500/30"
                >
                  <Smartphone className="w-3.5 h-3.5 mr-1.5" /> Enable Browser Push
                </Button>
              </Card>

              {/* Categories Toggles Card */}
              <Card className="p-5 space-y-4 bg-slate-900/80 border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-extrabold text-slate-100 text-sm">Daily Reminder Toggles</h3>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Water */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-medium text-slate-200">Drink Water</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.categories.water}
                      onChange={() => handleToggleCategory('water')}
                      className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>

                  {/* Exercise */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-medium text-slate-200">Exercise & Activity</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.categories.exercise}
                      onChange={() => handleToggleCategory('exercise')}
                      className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>

                  {/* Log Meals */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-medium text-slate-200">Log Meals</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.categories.mealLog}
                      onChange={() => handleToggleCategory('mealLog')}
                      className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>

                  {/* Veggie Delivery */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-teal-400" />
                      <span className="font-medium text-slate-200">Vegetable Delivery</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.categories.veggieDelivery}
                      onChange={() => handleToggleCategory('veggieDelivery')}
                      className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>

                  {/* Subscription Renewal */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-medium text-slate-200">Subscription Renewal</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.categories.subscription}
                      onChange={() => handleToggleCategory('subscription')}
                      className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>

                  {/* Recipes */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                      <span className="font-medium text-slate-200">Recipe Suggestions</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.categories.recipe}
                      onChange={() => handleToggleCategory('recipe')}
                      className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Full Notifications History Feed */}
            <div className="space-y-4 lg:col-span-2">
              <Card className="p-6 space-y-4 bg-slate-900/80 border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-extrabold text-slate-100 text-base">In-App Notification Feed</h3>
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {['ALL', 'WATER', 'EXERCISE', 'MEAL_LOG', 'VEGGIE_DELIVERY', 'SUBSCRIPTION', 'RECIPE'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          activeCategoryFilter === cat
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 space-y-2 text-slate-500">
                      <Bell className="w-10 h-10 mx-auto text-slate-600" />
                      <p className="text-xs">No notifications found for this category.</p>
                      <p className="text-[11px] text-slate-600">Click a test trigger button above to generate a live reminder!</p>
                    </div>
                  ) : (
                    filteredNotifications.map((n) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                          n.isRead
                            ? 'bg-slate-950/50 border-slate-800/80 text-slate-300'
                            : 'bg-slate-900 border-emerald-500/30 text-slate-100 shadow-md shadow-emerald-950/20'
                        }`}
                      >
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                          {n.category === 'WATER' && <Droplet className="w-4 h-4 text-cyan-400" />}
                          {n.category === 'EXERCISE' && <Dumbbell className="w-4 h-4 text-emerald-400" />}
                          {n.category === 'MEAL_LOG' && <Utensils className="w-4 h-4 text-amber-400" />}
                          {n.category === 'VEGGIE_DELIVERY' && <Package className="w-4 h-4 text-teal-400" />}
                          {n.category === 'SUBSCRIPTION' && <CreditCard className="w-4 h-4 text-indigo-400" />}
                          {n.category === 'RECIPE' && <BookOpen className="w-4 h-4 text-rose-400" />}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-xs text-slate-100 flex items-center gap-2">
                              <span>{n.title}</span>
                              {!n.isRead && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              )}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                        </div>

                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(n.id)}
                            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>

        {/* Mobile Navigation */}
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
