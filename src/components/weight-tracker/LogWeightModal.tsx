'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Plus } from 'lucide-react';

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogWeight: (weightKg: number, bodyFatPct?: number, notes?: string) => void;
}

export const LogWeightModal: React.FC<LogWeightModalProps> = ({
  isOpen,
  onClose,
  onLogWeight,
}) => {
  const [weight, setWeight] = useState('68.5');
  const [bodyFat, setBodyFat] = useState('18.5');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wKg = parseFloat(weight) || 68.5;
    const bf = bodyFat ? parseFloat(bodyFat) : undefined;

    onLogWeight(wKg, bf, notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Weight & Body Fat">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Current Weight (kg)"
          type="number"
          step="0.1"
          placeholder="e.g. 68.5"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />

        <Input
          label="Body Fat % (Optional)"
          type="number"
          step="0.1"
          placeholder="e.g. 18.5"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
        />

        <Input
          label="Notes / Activity Context (Optional)"
          type="text"
          placeholder="e.g. Morning weighing after fasting"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button variant="primary" type="submit" className="w-full py-2.5">
          <Plus className="w-4 h-4 mr-1.5" /> Save Weight Reading
        </Button>
      </form>
    </Modal>
  );
};
