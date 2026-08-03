'use client';

import React, { useState } from 'react';
import { useAuth } from '@/application/hooks/useAuth';
import { useAIAdvisor } from '@/application/hooks/useAIAdvisor';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { SAMPLE_FARM_PRODUCE } from '@/lib/constants/theme';
import { APP_ROUTES } from '@/lib/constants/routes';
import Link from 'next/link';
import {
  Sparkles,
  Leaf,
  ShieldCheck,
  Zap,
  Activity,
  Droplets,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const { loading: isAiLoading, response: aiResponse, fetchAdvice } = useAIAdvisor();

  const [selectedGoal, setSelectedGoal] = useState<string>('Immunity & Gut Longevity');
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(1750);
  const targetWaterMl = 3000;

  const handleAskGemini = async () => {
    const produceNames = SAMPLE_FARM_PRODUCE.map((p) => p.name);
    await fetchAdvice({
      produceHarvest: produceNames,
      healthGoals: [selectedGoal],
      userPrompt: `How can I consume these farm-fresh vegetables for ${selectedGoal}?`,
    });
  };

  const addWater = (amount: number) => {
    setWaterIntakeMl((prev) => Math.min(targetWaterMl, prev + amount));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-emerald-950/60 via-stone-900/80 to-teal-950/40 border border-emerald-500/20 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="emerald">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                Included Free with Farm Basket Subscription
              </Badge>
              <Badge variant="amber">
                <Sparkles className="w-3.5 h-3.5 mr-1 inline text-amber-400" />
                Powered by Gemini AI
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Turn Your{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                Farm Harvest
              </span>{' '}
              Into Bioactive Cellular Health
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
              Kshetriva Health+ integrates your weekly organic produce basket directly with clinical nutrition algorithms, daily vitals, and personalized AI meal intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {isAuthenticated ? (
                <Link href={APP_ROUTES.DASHBOARD}>
                  <Button variant="primary" size="lg" className="gap-2">
                    <Activity className="w-5 h-5" />
                    Open Health+ Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="gap-2"
                  onClick={() => loginWithGoogle()}
                >
                  <Lock className="w-5 h-5" />
                  Sign In with Google
                </Button>
              )}

              <Link href={APP_ROUTES.AI_ADVISOR}>
                <Button variant="secondary" size="lg" className="gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Try Gemini AI Advisor
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Membership Status Widget */}
          <div className="lg:col-span-4">
            <Card className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      Membership Status
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {user?.displayName || 'Kshetriva Member'}
                    </p>
                  </div>
                </div>
                <Badge variant={isAuthenticated ? 'emerald' : 'amber'}>
                  {isAuthenticated ? 'Active Access' : 'Demo Mode'}
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Basket Delivery:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Every Wednesday
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Chemical Audit:</span>
                  <span className="font-semibold text-emerald-500">100% Organic Verified</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>AI Advisor Credits:</span>
                  <span className="font-semibold text-amber-500">Unlimited VIP Access</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Gemini AI Advisor Section */}
      <section id="ai-advisor" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Gemini AI Integration
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              Personalized Harvest Nutrition Advisor
            </h2>
          </div>
          <Badge variant="teal">
            <Zap className="w-3.5 h-3.5 mr-1 inline" />
            Gemini 2.5 Flash Engine Connected
          </Badge>
        </div>

        <Card className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Primary Health Focus
              </label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-900 dark:text-stone-100"
              >
                <option value="Immunity & Gut Longevity">Immunity & Gut Longevity</option>
                <option value="Cellular Anti-Inflammation">Cellular Anti-Inflammation</option>
                <option value="Cardiovascular Strength">Cardiovascular Strength</option>
                <option value="Sustained Energy & Metabolism">Sustained Energy & Metabolism</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2 flex flex-col justify-end">
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                Analyzes this week harvested Palak, Desi Carrots, Broccoli, and Vedic Tomatoes against your selected goal.
              </p>
              <Button
                variant="primary"
                onClick={handleAskGemini}
                isLoading={isAiLoading}
                className="w-full sm:w-auto gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generate AI Nutrition Guidance
              </Button>
            </div>
          </div>

          {aiResponse?.adviceText && (
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-stone-200 text-sm leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Gemini AI Recommendation for {selectedGoal}:
              </div>
              <div className="whitespace-pre-line pt-1 text-stone-300">
                {aiResponse.adviceText}
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Produce Harvest Index Section */}
      <section id="basket-health" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Leaf className="w-4 h-4" />
              Weekly Basket Contents
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              This Harvest's Bioactive Profile
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_FARM_PRODUCE.map((produce) => (
            <Card key={produce.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  {produce.icon}
                </span>
                <Badge variant="emerald">{produce.caloriesPer100g} kcal / 100g</Badge>
              </div>

              <div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                  {produce.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Category: {produce.category}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                <p className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Health Benefits:
                </p>
                {produce.healthBenefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Vitals & Daily Hydration Section */}
      <section id="vitals" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                  Daily Hydration Vitals
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Target: {targetWaterMl} ml / day
                </p>
              </div>
            </div>
            <span className="text-2xl font-extrabold text-sky-500">
              {waterIntakeMl} <span className="text-xs font-normal text-stone-500">ml</span>
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-sky-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (waterIntakeMl / targetWaterMl) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-stone-500 font-medium">
              <span>0 ml</span>
              <span>{Math.round((waterIntakeMl / targetWaterMl) * 100)}% Completed</span>
              <span>{targetWaterMl} ml</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => addWater(250)} className="flex-1">
              +250 ml Glass
            </Button>
            <Button variant="secondary" size="sm" onClick={() => addWater(500)} className="flex-1">
              +500 ml Bottle
            </Button>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                  Daily Organic Portions
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Target: 5 Farm Portions / day
                </p>
              </div>
            </div>
            <span className="text-2xl font-extrabold text-amber-500">
              4 / 5 <span className="text-xs font-normal text-stone-500">Portions</span>
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`h-12 rounded-2xl flex items-center justify-center text-lg transition-all ${
                  idx <= 4
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-dashed border-stone-300 dark:border-stone-700'
                }`}
              >
                🌿
              </div>
            ))}
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 text-center font-medium">
            You are 1 organic portion away from reaching your daily cellular rejuvenation goal!
          </p>
        </Card>
      </section>
    </div>
  );
}
