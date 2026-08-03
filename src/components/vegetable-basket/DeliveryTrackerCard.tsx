'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Check, Clock, MapPin } from 'lucide-react';
import { Card } from '../common/Card';
import { DeliveryStatus } from '../../domain/entities/VegetableBasket';

interface DeliveryTrackerCardProps {
  status: DeliveryStatus;
  estimatedArrival: string;
}

export const DeliveryTrackerCard: React.FC<DeliveryTrackerCardProps> = ({
  status,
  estimatedArrival,
}) => {
  const steps: { label: DeliveryStatus; desc: string }[] = [
    { label: 'Harvesting', desc: 'Freshly harvested from organic fields' },
    { label: 'Quality Inspected', desc: 'Passed bio-purity quality check' },
    { label: 'In Transit', desc: 'Dispatched in cold storage van' },
    { label: 'Out for Delivery', desc: 'On its way to your doorstep' },
    { label: 'Delivered', desc: 'Delivered to subscriber address' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.label === status);

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Live Delivery Tracking</h3>
            <p className="text-[11px] text-slate-400">Farm-to-doorstep logistics status</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-400 block">ETA</span>
          <span className="text-xs font-extrabold text-cyan-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {estimatedArrival}
          </span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative pt-2 pb-4">
        <div className="grid grid-cols-5 gap-2 relative z-10">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={idx} className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold transition-all border ${
                    isDone
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-cyan-500 to-teal-400 text-white border-cyan-300 animate-pulse shadow-lg shadow-cyan-900/40 ring-4 ring-cyan-500/20'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="space-y-0.5">
                  <span
                    className={`text-[11px] font-bold block leading-tight ${
                      isCurrent
                        ? 'text-cyan-300'
                        : isDone
                        ? 'text-emerald-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
