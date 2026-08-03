'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../../infrastructure/services/notificationService';
import { NotificationItem, NotificationCategory } from '../../domain/entities/Notification';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Droplet,
  Dumbbell,
  Utensils,
  Package,
  CreditCard,
  BookOpen,
  ArrowRight,
  Settings,
} from 'lucide-react';

export const NotificationBellWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifs = () => {
    setNotifications(notificationService.getNotifications());
  };

  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === 'ALL') return true;
    return n.category === activeCategory;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'WATER':
        return <Droplet className="w-3.5 h-3.5 text-cyan-400" />;
      case 'EXERCISE':
        return <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />;
      case 'MEAL_LOG':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'VEGGIE_DELIVERY':
        return <Package className="w-3.5 h-3.5 text-teal-400" />;
      case 'SUBSCRIPTION':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-400" />;
      case 'RECIPE':
        return <BookOpen className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Icon Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
        aria-label="View In-App Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[520px]"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-slate-100">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="p-2 border-b border-slate-800/80 flex items-center gap-1 overflow-x-auto scrollbar-none bg-slate-950/40">
              {['ALL', 'WATER', 'EXERCISE', 'MEAL_LOG', 'VEGGIE_DELIVERY', 'SUBSCRIPTION'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Feed List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-800/50">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 space-y-2 text-slate-500">
                  <Bell className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">No notifications in this filter.</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-2xl transition-all flex items-start gap-3 group relative ${
                      notif.isRead
                        ? 'bg-slate-900/40 hover:bg-slate-800/40 text-slate-300'
                        : 'bg-slate-800/80 border border-emerald-500/20 text-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                      {getCategoryIcon(notif.category)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs truncate">{notif.title}</h4>
                        <span className="text-[9px] text-slate-500 font-mono shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{notif.message}</p>

                      {notif.actionUrl && (
                        <Link
                          href={notif.actionUrl}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 pt-0.5"
                        >
                          <span>Open details</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>

                    {!notif.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="p-1 rounded-lg text-slate-500 hover:text-emerald-400 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Notification Settings & Schedule</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
