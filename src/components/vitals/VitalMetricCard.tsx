'use client';

import React from 'react';
import { Heart, Activity, ActivityIcon, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Vital } from '../../domain/entities/Vital';

interface VitalMetricCardProps {
  vital: Vital;
}

export const VitalMetricCard: React.FC<VitalMetricCardProps> = ({ vital }) => {
  const getIcon = (type: Vital['type']) => {
    switch (type) {
      case 'heartRate':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'bloodPressure':
        return <Activity className="w-4 h-4 text-indigo-400" />;
      case 'bloodGlucose':
        return <ActivityIcon className="w-4 h-4 text-amber-400" />;
      case 'spo2':
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      default:
        return <Heart className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getTypeLabel = (type: Vital['type']) => {
    switch (type) {
      case 'heartRate':
        return 'Heart Rate';
      case 'bloodPressure':
        return 'Blood Pressure';
      case 'bloodGlucose':
        return 'Blood Glucose';
      case 'spo2':
        return 'Blood Oxygen SpO2';
      default:
        return type;
    }
  };

  return (
    <Card className="p-5 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            {getIcon(vital.type)}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">{getTypeLabel(vital.type)}</h4>
            <p className="text-[10px] text-slate-400">{vital.recordedAt}</p>
          </div>
        </div>

        <span
          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
            vital.status === 'normal'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}
        >
          {vital.status}
        </span>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <span className="text-2xl font-extrabold text-slate-100 tracking-tight">
          {vital.value}
        </span>
        <span className="text-xs font-bold text-slate-400">{vital.unit}</span>
      </div>
    </Card>
  );
};
