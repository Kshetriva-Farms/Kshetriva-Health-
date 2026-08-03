'use client';

import React, { createContext, useContext, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center justify-between transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 border-emerald-500/40 text-emerald-100 backdrop-blur-md'
                : toast.type === 'error'
                ? 'bg-red-900/90 border-red-500/40 text-red-100 backdrop-blur-md'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 border-amber-500/40 text-amber-100 backdrop-blur-md'
                : 'bg-stone-900/90 border-emerald-500/20 text-stone-100 backdrop-blur-md'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-stone-400 hover:text-stone-200 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
