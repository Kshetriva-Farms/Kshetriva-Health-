'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Vital } from '../../domain/entities/Vital';
import { Plus } from 'lucide-react';

interface LogVitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVital: (vital: Omit<Vital, 'id' | 'recordedAt'>) => void;
}

export const LogVitalModal: React.FC<LogVitalModalProps> = ({
  isOpen,
  onClose,
  onAddVital,
}) => {
  const [type, setType] = useState<Vital['type']>('heartRate');
  const [value, setValue] = useState('72');
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(value) || 72;

    let unit = 'BPM';
    let status: Vital['status'] = 'normal';

    if (type === 'heartRate') {
      unit = 'BPM';
      if (val > 100) status = 'warning';
    } else if (type === 'bloodPressure') {
      unit = 'mmHg';
      const sys = parseFloat(systolic) || 120;
      if (sys > 130) status = 'warning';
    } else if (type === 'bloodGlucose') {
      unit = 'mg/dL';
      if (val > 140) status = 'warning';
    } else if (type === 'spo2') {
      unit = '%';
      if (val < 95) status = 'warning';
    }

    onAddVital({
      type,
      value: val,
      unit,
      status,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Health Vital Metric">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Vital Metric Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Vital['type'])}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="heartRate">Heart Rate (BPM)</option>
            <option value="bloodPressure">Blood Pressure (mmHg)</option>
            <option value="bloodGlucose">Blood Glucose (mg/dL)</option>
            <option value="spo2">Blood Oxygen SpO2 (%)</option>
          </select>
        </div>

        {type === 'bloodPressure' ? (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Systolic (mmHg)"
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              required
            />
            <Input
              label="Diastolic (mmHg)"
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              required
            />
          </div>
        ) : (
          <Input
            label={`Recorded Value`}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        )}

        <Button variant="primary" type="submit" className="w-full py-2.5">
          <Plus className="w-4 h-4 mr-1.5" /> Record Vital Reading
        </Button>
      </form>
    </Modal>
  );
};
