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
import {
  subscriptionService,
  SUBSCRIPTION_PLANS,
  VALID_COUPONS,
} from '../../infrastructure/services/subscriptionService';
import {
  UserSubscriptionState,
  Invoice,
  SubscriptionPlan,
  SubscriptionCycle,
} from '../../domain/entities/Subscription';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  XCircle,
  Zap,
  Tag,
  Copy,
  Check,
  Download,
  Share2,
  ShieldCheck,
  Sparkles,
  Calendar,
  DollarSign,
  Gift,
  FileText,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [subState, setSubState] = useState<UserSubscriptionState | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<SubscriptionCycle>('monthly');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Referral copy feedback state
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Selected Invoice Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Upgrade Modal state
  const [upgradeTargetPlan, setUpgradeTargetPlan] = useState<SubscriptionPlan | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    const current = subscriptionService.getSubscriptionState();
    setSubState(current);
    setSelectedCycle(current.planId);
    setInvoices(subscriptionService.getInvoices());
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponSuccess(null);
    setCouponError(null);

    const coupon = subscriptionService.validateCoupon(couponInput);
    if (coupon) {
      setAppliedDiscount(coupon.discountPercent);
      setCouponSuccess(`Coupon applied! You get ${coupon.discountPercent}% OFF on your plan change.`);
    } else {
      setAppliedDiscount(0);
      setCouponError('Invalid coupon code. Try "HEALTHPLUS20" or "FARM100".');
    }
  };

  const handleRenew = () => {
    if (!subState) return;
    const updated = subscriptionService.renewSubscription();
    setSubState(updated);
    setInvoices(subscriptionService.getInvoices());
    alert('Subscription renewed successfully! Renewal period extended.');
  };

  const handleCancelAutoRenew = () => {
    if (!subState) return;
    if (confirm('Are you sure you want to cancel auto-renewal? You will keep benefits until the end of your billing cycle.')) {
      const updated = subscriptionService.cancelSubscription();
      setSubState(updated);
      alert('Auto-renewal cancelled.');
    }
  };

  const handleToggleAutoRenew = () => {
    if (!subState) return;
    const updated = subscriptionService.toggleAutoRenew();
    setSubState(updated);
  };

  const handleExecuteUpgrade = (cycle: SubscriptionCycle) => {
    setIsUpgrading(true);
    setTimeout(() => {
      const updated = subscriptionService.upgradeOrChangePlan(cycle, couponSuccess ? couponInput : undefined);
      setSubState(updated);
      setInvoices(subscriptionService.getInvoices());
      setIsUpgrading(false);
      setUpgradeTargetPlan(null);
      alert(`Plan successfully updated to ${updated.planName}!`);
    }, 1000);
  };

  const handleCopyReferral = () => {
    if (!subState) return;
    navigator.clipboard.writeText(`https://kshetriva.com/signup?ref=${subState.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  if (!subState) return null;

  return (
    <ProtectedRoute fallbackMessage="Subscribers manage VIP Health+ plans, invoices, and coupons here.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Desktop Navigation */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 pt-8 pb-24 max-w-6xl mx-auto space-y-8 overflow-x-hidden">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="emerald">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> VIP Billing Portal
                  </Badge>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                  Subscription & Billing Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={subState.status === 'ACTIVE' ? 'emerald' : 'rose'}>
                {subState.status === 'ACTIVE' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 mr-1 inline text-rose-400" />
                )}
                {subState.status} STATUS
              </Badge>
            </div>
          </motion.div>

          {/* Current Active Plan Overview Card */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Current Subscription Plan
                </span>
                <h2 className="text-2xl font-extrabold text-white">{subState.planName}</h2>
                <p className="text-xs text-slate-400">
                  Billing cycle: <span className="text-slate-200 capitalize font-medium">{subState.planId}</span> • Amount Paid: <span className="text-emerald-300 font-mono font-bold">₹{subState.amountPaid.toLocaleString()}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="primary"
                  onClick={handleRenew}
                  className="py-2.5 px-4 text-xs font-semibold shadow-emerald-900/40"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Renew Plan
                </Button>

                {subState.status === 'ACTIVE' && (
                  <Button
                    variant="outline"
                    onClick={handleCancelAutoRenew}
                    className="py-2.5 px-4 text-xs font-semibold text-rose-400 hover:text-rose-300 border-slate-700 hover:border-rose-500/30"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel Auto-Renew
                  </Button>
                )}
              </div>
            </div>

            {/* Billing Metadata Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" /> Start Date
                </span>
                <p className="text-sm font-bold text-slate-200 font-mono">{subState.startDate}</p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Next Renewal Date
                </span>
                <p className="text-sm font-bold text-emerald-400 font-mono">{subState.endDate}</p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Auto-Renewal
                  </span>
                  <button
                    onClick={handleToggleAutoRenew}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      subState.autoRenew ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                        subState.autoRenew ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-300">
                  {subState.autoRenew ? 'Enabled (Auto Charges Card)' : 'Disabled (Expires on End Date)'}
                </p>
              </div>
            </div>
          </Card>

          {/* Subscription Plans Selection Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-100">Compare & Upgrade Subscription Plans</h3>
                <p className="text-xs text-slate-400">Choose between Weekly, Monthly, Quarterly, or Yearly billing tiers.</p>
              </div>

              {/* Cycle Toggle Selector */}
              <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800">
                {(['weekly', 'monthly', 'quarterly', 'yearly'] as SubscriptionCycle[]).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setSelectedCycle(cycle)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      selectedCycle === cycle
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>

            {/* Plans Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isCurrent = subState.planId === plan.id;
                const finalPrice = appliedDiscount > 0
                  ? Math.round(plan.priceInr * (1 - appliedDiscount / 100))
                  : plan.priceInr;

                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -4 }}
                    className={`relative p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                      plan.isPopular
                        ? 'bg-slate-900/90 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-slate-100 text-base">{plan.name}</h4>
                        {plan.savingsLabel && (
                          <Badge variant="teal">{plan.savingsLabel}</Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white font-mono">₹{finalPrice.toLocaleString()}</span>
                          <span className="text-xs text-slate-400">/{plan.cycle}</span>
                        </div>
                        {appliedDiscount > 0 && (
                          <span className="text-[11px] text-emerald-400 line-through font-mono">
                            ₹{plan.priceInr.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant={isCurrent ? 'outline' : plan.isPopular ? 'primary' : 'secondary'}
                      disabled={isCurrent}
                      onClick={() => setUpgradeTargetPlan(plan)}
                      className="w-full py-2.5 text-xs font-semibold mt-4"
                    >
                      {isCurrent ? 'Current Active Plan' : 'Select & Upgrade'}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Coupons & Referral Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coupon Code Redeemer */}
            <Card className="p-6 space-y-4 bg-slate-900/70 border-slate-800">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-slate-100 text-base">Redeem Coupon or Promo Code</h3>
              </div>

              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. HEALTHPLUS20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <Button variant="primary" type="submit" className="py-2.5 px-4 text-xs font-semibold">
                  Apply
                </Button>
              </form>

              {couponSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{couponSuccess}</span>
                </div>
              )}

              {couponError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Available Test Coupons:
                </span>
                {VALID_COUPONS.map((c) => (
                  <div key={c.code} className="flex items-center justify-between text-xs">
                    <code className="font-mono text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {c.code}
                    </code>
                    <span className="text-slate-400 text-[11px]">{c.description}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Referral Program Card */}
            <Card className="p-6 space-y-4 bg-slate-900/70 border-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-teal-400" />
                <h3 className="font-extrabold text-slate-100 text-base">Referral & Rewards Program</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Invite health-conscious friends to Kshetriva Health+. They get ₹500 off their first basket, and you earn ₹500 credit per referral.
              </p>

              <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <input
                  type="text"
                  readOnly
                  value={`https://kshetriva.com/signup?ref=${subState.referralCode}`}
                  className="flex-1 bg-transparent text-xs text-slate-200 font-mono px-2 outline-none"
                />
                <Button
                  variant="secondary"
                  onClick={handleCopyReferral}
                  className="py-1.5 px-3 text-xs font-semibold"
                >
                  {copiedReferral ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReferral ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Friends Referred
                  </span>
                  <span className="text-lg font-extrabold text-emerald-400 font-mono">
                    {subState.referralsCount}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Credits Earned
                  </span>
                  <span className="text-lg font-extrabold text-teal-400 font-mono">
                    ₹{subState.creditsEarnedInr.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Invoices History Table */}
          <Card className="p-6 space-y-4 bg-slate-900/70 border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-slate-100 text-base">Invoice History & Billing Receipts</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Invoice ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Plan Name</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">{inv.id}</td>
                      <td className="py-3 px-4 font-mono">{inv.date}</td>
                      <td className="py-3 px-4 font-medium text-slate-200">{inv.planName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-100">₹{inv.total.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant="emerald">PAID</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-200 font-semibold inline-flex items-center gap-1 transition-all"
                        >
                          <Download className="w-3 h-3 text-emerald-400" /> View Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Upgrade Confirmation Modal */}
          <AnimatePresence>
            {upgradeTargetPlan && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-extrabold text-slate-100 text-lg">Confirm Plan Upgrade</h3>
                    <button
                      onClick={() => setUpgradeTargetPlan(null)}
                      className="p-1 text-slate-400 hover:text-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Plan:</span>
                      <span className="font-bold text-slate-100">{upgradeTargetPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Billing Cycle:</span>
                      <span className="font-bold text-slate-100 capitalize">{upgradeTargetPlan.cycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subtotal:</span>
                      <span className="font-mono font-bold text-slate-200">₹{upgradeTargetPlan.priceInr.toLocaleString()}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Coupon Discount ({appliedDiscount}%):</span>
                        <span className="font-mono font-bold">
                          -₹{Math.round(upgradeTargetPlan.priceInr * (appliedDiscount / 100)).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
                      <span>Total Due Today:</span>
                      <span className="font-mono text-emerald-400">
                        ₹{Math.round(upgradeTargetPlan.priceInr * (1 - appliedDiscount / 100)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setUpgradeTargetPlan(null)}
                      className="flex-1 py-2.5 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      isLoading={isUpgrading}
                      onClick={() => handleExecuteUpgrade(upgradeTargetPlan.cycle)}
                      className="flex-1 py-2.5 text-xs font-semibold"
                    >
                      Confirm Upgrade
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Invoice Receipt Modal */}
          <AnimatePresence>
            {selectedInvoice && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-extrabold text-slate-100 text-lg">Official Tax Receipt</h3>
                    </div>
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="p-1 text-slate-400 hover:text-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-black text-slate-100 text-base tracking-tight">Kshetriva Health+</h4>
                        <p className="text-[10px] text-slate-400">Kshetriva Organic Farms Pvt Ltd</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-400 block">{selectedInvoice.id}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{selectedInvoice.date}</span>
                      </div>
                    </div>

                    <div className="space-y-2 py-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subscriber Name:</span>
                        <span className="font-semibold text-slate-200">{user?.displayName || 'VIP Subscriber'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Plan Description:</span>
                        <span className="font-semibold text-slate-200">{selectedInvoice.planName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subtotal:</span>
                        <span className="font-mono text-slate-200">₹{selectedInvoice.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">GST Tax (5%):</span>
                        <span className="font-mono text-slate-200">₹{selectedInvoice.tax.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-3 border-t border-slate-800 text-sm font-extrabold text-white">
                      <span>Total Paid:</span>
                      <span className="font-mono text-emerald-400">₹{selectedInvoice.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                      className="py-2 px-4 text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5 mr-1 inline" /> Print / Save PDF
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedInvoice(null)}
                      className="py-2 px-4 text-xs font-semibold"
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
