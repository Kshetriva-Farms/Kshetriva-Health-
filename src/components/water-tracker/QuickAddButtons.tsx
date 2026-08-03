'use client';

import React, { useState } from 'react';
import { Plus, Droplet, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface QuickAddButtonsProps {
  onAddWater: (amountMl: number) => void;
}

export const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({ onAddWater }) => {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState('350');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(customAmount) || 250;
    onAddWater(val);
    setIsCustomModalOpen(false);
  };

  const presetAmounts = [
    { label: '+250 ml', sub: '1 Small Glass', value: 250, color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' },
    { label: '+500 ml', sub: '1 Standard Bottle', value: 500, color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
    { label: '+750 ml', sub: '1 Large Flask', value: 750, color: 'border-teal-500/30 bg-teal-500/10 text-teal-300' },
    { label: '+1 Liter', sub: '1,000 ml Pitcher', value: 1000, color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
  ];

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Quick Add Water</h3>
            <p className="text-[11px] text-slate-400">Tap to instantly record intake</p>
          </div>
        </div>

        <Button
          variant="glass"
          onClick={() => setIsCustomModalOpen(true)}
          className="text-xs py-1.5 px-3 text-cyan-400 gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" /> Custom Amount
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {presetAmounts.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onAddWater(preset.value)}
            className={`p-4 rounded-2xl border text-center transition-all transform hover:scale-[1.03] active:scale-95 space-y-1 ${preset.color}`}
          >
            <Droplet className="w-5 h-5 mx-auto" />
            <p className="text-base font-extrabold">{preset.label}</p>
            <p className="text-[10px] opacity-80">{preset.sub}</p>
          </button>
        ))}
      </div>

      {/* Custom Amount Modal */}
      <Modal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        title="Log Custom Water Intake"
      >
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <Input
            label="Water Intake Volume (ml)"
            type="number"
            placeholder="e.g. 350"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            required
          />

          <div className="grid grid-cols-3 gap-2">
            {[150, 350, 600].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setCustomAmount(String(val))}
                className="py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200"
              >
                {val} ml
              </button>
            ))}
          </div>

          <Button variant="primary" type="submit" className="w-full py-2.5">
            <Plus className="w-4 h-4 mr-1.5" /> Save Custom Hydration
          </Button>
        </form>
      </Modal>
    </Card>
  );
};
