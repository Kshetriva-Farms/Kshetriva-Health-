'use client';

import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FarmRecipe } from '../../domain/entities/Recipe';
import { useToast } from '../../application/context/ToastContext';
import { Share2, Copy, Check, MessageSquare } from 'lucide-react';

interface ShareRecipeModalProps {
  recipe: FarmRecipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareRecipeModal: React.FC<ShareRecipeModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();

  if (!recipe) return null;

  const shareText = `Check out this farm-fresh Indian recipe: "${recipe.title}" (${recipe.estimatedCalories} kcal, ${recipe.macros.protein}g protein) crafted from organic farm produce on Kshetriva Health+!`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://kshetriva-health-plus.app/recipes';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      showToast('Recipe text & link copied to clipboard!', 'success');
    } else {
      showToast('Recipe link copied.', 'info');
    }
    onClose();
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share ${recipe.title}`}>
      <div className="space-y-4">
        <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-300 font-medium">{shareText}</p>
          <p className="text-[10px] text-emerald-400 font-mono truncate">{shareUrl}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <MessageSquare className="w-4 h-4" /> Share on WhatsApp
          </button>

          <Button
            variant="glass"
            onClick={handleCopyLink}
            className="py-3 text-xs gap-2 text-cyan-300"
          >
            <Copy className="w-4 h-4" /> Copy Link & Text
          </Button>
        </div>
      </div>
    </Modal>
  );
};
