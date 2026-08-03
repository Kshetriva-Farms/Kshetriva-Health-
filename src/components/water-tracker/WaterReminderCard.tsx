'use client';

import React, { useState } from 'react';
import { Bell, BellRing, Check, ShieldCheck, Zap } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useToast } from '../../application/context/ToastContext';

export const WaterReminderCard: React.FC = () => {
  const { showToast } = useToast();

  const [intervalHours, setIntervalHours] = useState<number>(2);
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(false);

  const handleToggleReminders = async () => {
    if (!remindersEnabled) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setRemindersEnabled(true);
          showToast(`Hydration reminders enabled every ${intervalHours} hours!`, 'success');
        } else {
          showToast('Notification permission denied by browser settings.', 'warning');
        }
      } else {
        setRemindersEnabled(true);
        showToast(`Reminders active every ${intervalHours} hours.`, 'info');
      }
    } else {
      setRemindersEnabled(false);
      showToast('Hydration reminders disabled.', 'info');
    }
  };

  const handleTestNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('💧 Kshetriva Hydration Reminder', {
        body: 'Time to drink a glass of fresh water! Stay hydrated for optimal metabolic energy.',
        icon: '/favicon.ico',
      });
      showToast('Test notification sent!', 'success');
    } else {
      showToast('💧 Time to drink a glass of water! Stay hydrated.', 'info');
    }
  };

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Hydration Reminders</h3>
            <p className="text-[11px] text-slate-400">Smart browser alerts & notifications</p>
          </div>
        </div>

        <button
          onClick={handleToggleReminders}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            remindersEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {remindersEnabled ? <BellRing className="w-3.5 h-3.5 text-emerald-400" /> : <Bell className="w-3.5 h-3.5" />}
          <span>{remindersEnabled ? 'Active' : 'Disabled'}</span>
        </button>
      </div>

      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold">Reminder Frequency:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((hrs) => (
              <button
                key={hrs}
                type="button"
                onClick={() => setIntervalHours(hrs)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  intervalHours === hrs
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Every {hrs}h
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            Receive gentle reminders throughout your active hours to meet your daily 3.0L goal.
          </p>
          <Button
            variant="glass"
            onClick={handleTestNotification}
            className="text-xs py-1.5 px-3 shrink-0 text-indigo-300"
          >
            Test Alert
          </Button>
        </div>
      </div>
    </Card>
  );
};
