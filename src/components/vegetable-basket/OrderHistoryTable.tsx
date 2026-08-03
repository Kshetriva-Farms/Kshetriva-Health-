'use client';

import React from 'react';
import { History, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { BasketOrder } from '../../domain/entities/VegetableBasket';
import { useToast } from '../../application/context/ToastContext';

interface OrderHistoryTableProps {
  orders: BasketOrder[];
}

export const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({ orders }) => {
  const { showToast } = useToast();

  const handleDownloadInvoice = (orderNumber: string) => {
    showToast(`Downloading Official Tax Invoice for Order #${orderNumber} (PDF)`, 'info');
  };

  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Order History & Invoices</h3>
            <p className="text-[11px] text-slate-400">Past farm deliveries & downloadable receipts</p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          {orders.length} Past Deliveries
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-200">{ord.orderNumber}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {ord.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Delivered on {ord.deliveryDate} • {ord.itemsCount} Organic Produce Items • {ord.harvestLocation}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
              <span className="text-sm font-extrabold text-slate-100">${ord.totalAmount.toFixed(2)}</span>
              <button
                onClick={() => handleDownloadInvoice(ord.orderNumber)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-all border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" /> Invoice (PDF)
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
