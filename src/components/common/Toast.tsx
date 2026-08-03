import React from 'react';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-200',
    error: 'border-rose-500/30 bg-rose-950/40 text-rose-200',
    warning: 'border-amber-500/30 bg-amber-950/40 text-amber-200',
    info: 'border-cyan-500/30 bg-cyan-950/40 text-cyan-200'
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 min-w-[280px] max-w-md',
        borders[toast.type]
      )}
    >
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{toast.title}</h4>
        {toast.message && <p className="text-xs mt-1 opacity-90">{toast.message}</p>}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
