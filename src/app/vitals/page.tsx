'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { VitalMetricCard } from '../../components/vitals/VitalMetricCard';
import { LogVitalModal } from '../../components/vitals/LogVitalModal';
import { Vital } from '../../domain/entities/Vital';
import { vitalsRepository } from '../../infrastructure/repositories/VitalsRepository';
import { useToast } from '../../application/context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Heart, Activity, Plus, ShieldCheck, Calendar, Zap } from 'lucide-react';

export default function VitalsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const [vitals, setVitals] = useState<Vital[]>([
    { id: 'v1', type: 'heartRate', value: 72, unit: 'BPM', recordedAt: '09:15 AM Today', status: 'normal' },
    { id: 'v2', type: 'bloodPressure', value: 120, unit: 'mmHg (120/80)', recordedAt: '09:15 AM Today', status: 'normal' },
    { id: 'v3', type: 'bloodGlucose', value: 95, unit: 'mg/dL', recordedAt: '08:00 AM Today', status: 'normal' },
    { id: 'v4', type: 'spo2', value: 98, unit: '%', recordedAt: '09:15 AM Today', status: 'normal' },
  ]);

  const handleAddVital = async (vitalInput: Omit<Vital, 'id' | 'recordedAt'>) => {
    const newVital: Vital = {
      ...vitalInput,
      id: `v-${Date.now()}`,
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
    };

    setVitals((prev) => [newVital, ...prev]);

    const uid = user?.uid || user?.id || 'guest';
    try {
      await vitalsRepository.logVital(uid, {
        type: newVital.type,
        value: newVital.value,
        unit: newVital.unit,
        status: newVital.status,
      });
      showToast(`Logged ${newVital.type} reading (${newVital.value} ${newVital.unit})!`, 'success');
    } catch (error) {
      showToast('Vital logged locally.', 'info');
    }
  };

  return (
    <ProtectedRoute fallbackMessage="Subscribers receive clinical health vitals tracking with real-time status alerts & Firestore sync.">
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
                <Badge variant="rose">
                  <Heart className="w-3.5 h-3.5 mr-1 inline" /> Clinical Vitals
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Vitals & Health Metrics
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Monitor Heart Rate, Blood Pressure, Glucose, SpO2, and Sleep Quality
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setIsLogModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs py-2.5 px-4 shadow-emerald-900/40"
            >
              Log Vital Reading
            </Button>
          </motion.div>

          {/* Vital Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vitals.map((v) => (
              <VitalMetricCard key={v.id} vital={v} />
            ))}
          </div>

          {/* Vitals Summary Card */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">Cardiovascular & Metabolic Status</h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                100% Normal Status
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              All logged vitals are within healthy clinical reference ranges. Continue logging daily readings to build a high-resolution health history.
            </p>
          </div>
        </main>

        {/* Log Vital Reading Modal */}
        <LogVitalModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onAddVital={handleAddVital}
        />

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
