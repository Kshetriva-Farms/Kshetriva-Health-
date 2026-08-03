'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { analyticsService } from '../../infrastructure/services/analyticsService';
import {
  DailyCalorieData,
  WeightProgressData,
  WaterIntakeData,
  MacroDistribution,
  MealFrequencyData,
  HealthScoreSummary,
} from '../../domain/entities/Analytics';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  Droplet,
  Flame,
  Award,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  Printer,
  X,
  Zap,
  Activity,
  CheckCircle2,
  Utensils,
  CreditCard,
  Scale,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [showReportModal, setShowReportModal] = useState(false);

  // Data State
  const [calorieData, setCalorieData] = useState<DailyCalorieData[]>([]);
  const [weightData, setWeightData] = useState<WeightProgressData[]>([]);
  const [waterData, setWaterData] = useState<WaterIntakeData[]>([]);
  const [macroData, setMacroData] = useState<MacroDistribution[]>([]);
  const [mealFreqData, setMealFreqData] = useState<MealFrequencyData[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScoreSummary | null>(null);

  useEffect(() => {
    setCalorieData(analyticsService.getDailyCalorieTrends());
    setWeightData(analyticsService.getWeightProgressTrends());
    setWaterData(analyticsService.getWaterIntakeTrends());
    setMacroData(analyticsService.getMacroDistribution());
    setMealFreqData(analyticsService.getMealFrequencyDistribution());
    setHealthScore(analyticsService.getHealthScore());
  }, []);

  const handleExportCSV = () => {
    analyticsService.exportAnalyticsCSV();
  };

  if (!healthScore) return null;

  return (
    <ProtectedRoute fallbackMessage="Subscribers get detailed health analytics, calorie trends, and weight progress charts.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Navigation Sidebar */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 pt-8 pb-24 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 sm:p-6 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30 shrink-0">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="emerald">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> VIP Analytics Engine
                  </Badge>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                  Health & Nutrition Analytics Dashboard
                </h1>
              </div>
            </div>

            {/* Actions & Time Range Selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
                {(['7d', '30d', '90d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all ${
                      timeRange === range
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowReportModal(true)}
                className="py-2.5 px-4 text-xs font-semibold text-teal-300 border-slate-700 hover:border-teal-500/30"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Printable Summary
              </Button>

              <Button
                variant="primary"
                onClick={handleExportCSV}
                className="py-2.5 px-4 text-xs font-semibold shadow-emerald-900/40"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV Logs
              </Button>
            </div>
          </motion.div>

          {/* Health Performance Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950/40 border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Health Score</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white font-mono">{healthScore.overallScore}<span className="text-sm font-normal text-slate-400">/100</span></p>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Excellent Vitality Status
              </span>
            </Card>

            <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calorie Deficit Target</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white font-mono">1,810 <span className="text-xs font-normal text-slate-400">kcal/day avg</span></p>
              <span className="text-[11px] font-semibold text-emerald-400">
                {healthScore.calorieAdherenceScore}% Target Match
              </span>
            </Card>

            <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Weight & BMI</span>
                <Scale className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-white font-mono">68.5 <span className="text-xs font-normal text-slate-400">kg (BMI {healthScore.bmi})</span></p>
              <span className="text-[11px] font-semibold text-teal-300">
                {healthScore.bmiCategory}
              </span>
            </Card>

            <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Daily Hydration</span>
                <Droplet className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white font-mono">2,900 <span className="text-xs font-normal text-slate-400">ml/day</span></p>
              <span className="text-[11px] font-semibold text-blue-400">
                {healthScore.hydrationScore}% Goal Met
              </span>
            </Card>
          </div>

          {/* Row 1: Weight Progress Line Chart & Daily Calorie Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Progress Line Chart Simulation */}
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Weight Loss Progress Curve
                  </h3>
                  <p className="text-xs text-slate-400">Tracking progress from 72.5 kg to target 65.0 kg.</p>
                </div>
                <Badge variant="emerald">-4.0 kg Lost</Badge>
              </div>

              {/* Line Chart Visual Representation */}
              <div className="h-56 flex items-end justify-between gap-4 pt-8 border-b border-slate-800 pb-2 px-4 relative">
                {/* Target Goal Line Overlay */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-emerald-500/40 flex justify-end pr-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-slate-900 px-1.5 rounded -mt-2">
                    Goal: 65.0 kg
                  </span>
                </div>

                {weightData.map((w, i) => {
                  const hPct = Math.round(((w.weightKg - 60) / 15) * 100);
                  return (
                    <div key={w.date} className="flex-1 flex flex-col items-center gap-2 group z-10">
                      <div className="text-xs font-bold text-emerald-300 font-mono">{w.weightKg} kg</div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${hPct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="w-3 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-full group-hover:scale-125 transition-all shadow-md shadow-emerald-950/40"
                      />
                      <span className="text-[11px] text-slate-400 font-medium">{w.date}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Daily Calories Bar Chart */}
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" /> Weekly Calorie Intake vs Target
                  </h3>
                  <p className="text-xs text-slate-400">7-day calorie intake against your 2,000 kcal limit.</p>
                </div>
                <Badge variant="teal">2,000 kcal Target</Badge>
              </div>

              <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-slate-800 pb-2">
                {calorieData.map((c) => {
                  const pct = Math.round((c.consumed / 2200) * 100);
                  const isOver = c.consumed > c.target;
                  return (
                    <div key={c.day} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-mono font-bold text-slate-300">{c.consumed}</span>
                      <div className="w-full max-w-[36px] bg-slate-950 rounded-t-xl h-36 flex items-end justify-center overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                          className={`w-full rounded-t-xl ${
                            isOver
                              ? 'bg-gradient-to-t from-rose-600 to-amber-500'
                              : 'bg-gradient-to-t from-emerald-600 to-teal-400'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300">{c.day}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Row 2: Macro Distribution & Meal Frequency Pie Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Macro Breakdown Pie/Donut Chart */}
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" /> Macronutrient Ratio
                </h3>
                <Badge variant="emerald">30/45/25 Target</Badge>
              </div>

              {/* Donut Visual Representation */}
              <div className="flex items-center justify-center py-4">
                <div className="relative w-36 h-36 rounded-full bg-slate-950 border-8 border-slate-800 flex items-center justify-center shadow-inner">
                  <div className="w-24 h-24 rounded-full bg-slate-900 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-extrabold text-emerald-400">30% Protein</span>
                    <span className="text-[10px] text-slate-400">135g / day</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                {macroData.map((m) => (
                  <div key={m.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-slate-300 font-medium">{m.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-100">{m.percentage}% ({m.grams}g)</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Meal Frequency Pie Chart */}
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-teal-400" /> Meal Frequency Distribution
                </h3>
                <Badge variant="teal">30 Days</Badge>
              </div>

              <div className="space-y-3 pt-2">
                {mealFreqData.map((mf) => (
                  <div key={mf.mealType} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{mf.mealType}</span>
                      <span className="font-mono font-bold text-slate-100">{mf.percentage}% ({mf.count} meals)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${mf.percentage}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: mf.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Water Intake Hydration Bar Chart */}
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-400" /> Weekly Hydration Volume
                </h3>
                <Badge variant="teal">3.0L Goal</Badge>
              </div>

              <div className="h-44 flex items-end justify-between gap-2 pt-4 border-b border-slate-800 pb-2">
                {waterData.map((w) => {
                  const pct = Math.round((w.intakeMl / 3500) * 100);
                  return (
                    <div key={w.day} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[9px] font-mono text-cyan-300 font-bold">{(w.intakeMl / 1000).toFixed(1)}L</span>
                      <div className="w-full max-w-[28px] bg-slate-950 rounded-t-lg h-28 flex items-end justify-center overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                          className="w-full bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t-lg"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{w.day}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Printable Executive Health Report Modal */}
          <AnimatePresence>
            {showReportModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-extrabold text-slate-100 text-lg">Executive Health Summary Report</h3>
                    </div>
                    <button
                      onClick={() => setShowReportModal(false)}
                      className="p-1 text-slate-400 hover:text-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 bg-slate-950/90 p-6 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                      <div>
                        <h4 className="font-black text-slate-100 text-lg tracking-tight">Kshetriva Health+</h4>
                        <p className="text-slate-400">Clinical & Farm-to-Table Nutrition Analytics</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="emerald">Score: 92/100</Badge>
                        <span className="text-[10px] text-slate-400 block mt-1 font-mono">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                      <div>
                        <span className="text-slate-400 block font-semibold">Subscriber:</span>
                        <span className="font-bold text-slate-100 text-sm">{user?.displayName || 'VIP Member'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Current Goal:</span>
                        <span className="font-bold text-emerald-400 text-sm">{user?.primaryGoal || 'Weight Loss'}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] text-emerald-400">
                        Key Performance Summary
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Weight reduced from 72.5 kg to 68.5 kg (-4.0 kg total loss).</li>
                        <li>Daily average calorie intake: 1,810 kcal (94% adherence to 2,000 kcal limit).</li>
                        <li>Average daily hydration volume: 2,900 ml (90% target achieved).</li>
                        <li>Optimal macro distribution: 30% Protein, 45% Carbs, 25% Healthy Fats.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                      className="py-2.5 px-4 text-xs font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1.5" /> Print / Save PDF Report
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowReportModal(false)}
                      className="py-2.5 px-4 text-xs font-semibold"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Mobile Navigation */}
        <BottomNav onQuickAddOpen={() => setIsQuickAddOpen(true)} />

        {/* Quick Add Logging Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddWater={() => {}}
          onAddMeal={() => {}}
          onAddWeight={() => {}}
          onAddExercise={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
