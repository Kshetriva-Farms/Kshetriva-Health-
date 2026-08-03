'use client';

import React from 'react';
import { ShoppingBag, Calendar, Sparkles, Award, ShieldCheck, Zap } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { VegetableBasket } from '../../domain/entities/VegetableBasket';

interface CurrentBasketCardProps {
  basket: VegetableBasket;
}

export const CurrentBasketCard: React.FC<CurrentBasketCardProps> = ({ basket }) => {
  return (
    <Card className="p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Badge variant="emerald">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> Farm Fresh Harvest
              </Badge>
              <span className="text-[10px] font-bold text-slate-400">4.5 kg Total Weight</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-100">{basket.basketName}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Delivery: {basket.deliveryDate}
          </div>
        </div>
      </div>

      {/* Produce Items Included */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Produce Included in Today&apos;s Harvest
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {basket.produceList.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-200 block">
                  🌾 {item.name}
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {item.keyNutrients.map((nut, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[9px] font-semibold"
                    >
                      {nut}
                    </span>
                  ))}
                </div>
              </div>

              <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                {item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Summary Bar */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-teal-400" /> Bioactive Nutrition Summary
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase">Dietary Fiber</span>
            <p className="text-lg font-extrabold text-emerald-200">{basket.nutritionSummary.fiberG}g</p>
          </div>

          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-center">
            <span className="text-[10px] font-semibold text-teal-400 uppercase">Vitamin C</span>
            <p className="text-lg font-extrabold text-teal-200">{basket.nutritionSummary.vitCMg}mg</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-semibold text-amber-400 uppercase">Organic Iron</span>
            <p className="text-lg font-extrabold text-amber-200">{basket.nutritionSummary.ironMg}mg</p>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase">Folate B9</span>
            <p className="text-lg font-extrabold text-cyan-200">{basket.nutritionSummary.folateMcg}mcg</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
