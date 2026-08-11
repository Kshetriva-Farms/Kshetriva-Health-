'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { adminService } from '../../infrastructure/services/adminService';
import {
  AdminMetrics,
  AdminUserRecord,
  AdminOrderRecord,
  AdminVegetableRecord,
  AdminBroadcastNotification,
} from '../../domain/entities/Admin';
import {
  ShieldAlert,
  Users,
  ShoppingBag,
  CreditCard,
  Sprout,
  Utensils,
  Calendar,
  Bell,
  TrendingUp,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Sparkles,
  BarChart3,
  X,
  RefreshCw,
} from 'lucide-react';

type AdminTab =
  | 'analytics'
  | 'users'
  | 'orders'
  | 'subscriptions'
  | 'vegetables'
  | 'recipes'
  | 'meal-plans'
  | 'notifications';

export default function AdminPanelPage() {
  const { user } = useAuth();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Admin Data State
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [ordersList, setOrdersList] = useState<AdminOrderRecord[]>([]);
  const [veggiesList, setVeggiesList] = useState<AdminVegetableRecord[]>([]);
  const [notifsList, setNotifsList] = useState<AdminBroadcastNotification[]>([]);

  // Search & Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Broadcast Notification Form state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifTarget, setNotifTarget] = useState<'All Users' | 'Active Subscribers' | 'VIP Members'>('All Users');

  useEffect(() => {
    setMetrics(adminService.getMetrics());
    setUsersList(adminService.getUsers());
    setOrdersList(adminService.getOrders());
    setVeggiesList(adminService.getVegetables());
    setNotifsList(adminService.getNotifications());
  }, []);

  // Reset pagination on tab/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter]);

  const revenueChartData = useMemo(() => adminService.getRevenueChartData(), []);

  // Filtered lists calculation
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.subscriptionTier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || u.status.toUpperCase() === statusFilter.toUpperCase();
      return matchSearch && matchStatus;
    });
  }, [usersList, searchQuery, statusFilter]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      const matchSearch =
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || o.status.toUpperCase() === statusFilter.toUpperCase();
      return matchSearch && matchStatus;
    });
  }, [ordersList, searchQuery, statusFilter]);

  const filteredVeggies = useMemo(() => {
    return veggiesList.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || v.status.toUpperCase().replace(/\s+/g, '_') === statusFilter.toUpperCase();
      return matchSearch && matchStatus;
    });
  }, [veggiesList, searchQuery, statusFilter]);

  // Paginated Slices
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const paginatedVeggies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVeggies.slice(start, start + itemsPerPage);
  }, [filteredVeggies, currentPage]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'Pending' | 'Dispatched' | 'Delivered' | 'Cancelled') => {
    const updated = ordersList.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrdersList(updated);
    adminService.saveOrders(updated);
  };

  const handleToggleVeggieStock = (veggieId: string) => {
    const updated = veggiesList.map((v) => {
      if (v.id === veggieId) {
        const nextStatus: 'In Stock' | 'Out of Stock' = v.status === 'In Stock' ? 'Out of Stock' : 'In Stock';
        return { ...v, status: nextStatus, stockKg: nextStatus === 'In Stock' ? 100 : 0 };
      }
      return v;
    });
    setVeggiesList(updated);
    adminService.saveVegetables(updated);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;
    const updated = adminService.sendBroadcastNotification(notifTitle, notifMessage, notifTarget);
    setNotifsList(updated);
    setNotifTitle('');
    setNotifMessage('');
    alert('Broadcast Notification published successfully!');
  };

  const handleExportData = () => {
    if (activeTab === 'users') adminService.exportReportCSV('Users', usersList);
    else if (activeTab === 'orders') adminService.exportReportCSV('Orders', ordersList);
    else if (activeTab === 'vegetables') adminService.exportReportCSV('Vegetables', veggiesList);
    else adminService.exportReportCSV('Revenue_Analytics', revenueChartData);
  };

  const navTabs: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'analytics', label: 'Analytics & Revenue', icon: BarChart3 },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'orders', label: 'Orders Logistics', icon: ShoppingBag },
    { id: 'subscriptions', label: 'Subscriptions MRR', icon: CreditCard },
    { id: 'vegetables', label: 'Produce Inventory', icon: Sprout },
    { id: 'recipes', label: 'Recipes Catalog', icon: Utensils },
    { id: 'meal-plans', label: 'Meal Plans', icon: Calendar },
    { id: 'notifications', label: 'Broadcast Alerts', icon: Bell },
  ];

  if (!metrics) return null;

  return (
    <ProtectedRoute requireAdmin fallbackMessage="Access Restricted. Admin Panel is reserved for system administrators.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Desktop Sidebar Navigation */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 pt-8 pb-24 max-w-7xl mx-auto space-y-6 overflow-x-hidden">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 sm:p-6 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="amber">
                    <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> Executive Admin Suite
                  </Badge>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                  Kshetriva Health+ Admin Panel
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={handleExportData}
                className="py-2.5 px-4 text-xs font-semibold shadow-emerald-900/40"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Export Reports
              </Button>
            </div>
          </motion.div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Global Search & Filters Bar (Shown for data tables) */}
          {activeTab !== 'analytics' && activeTab !== 'notifications' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search in ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400 ml-1" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active / Delivered / In Stock</option>
                  <option value="PENDING">Pending / Low Stock</option>
                  <option value="INACTIVE">Inactive / Out of Stock</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 1: ANALYTICS & REVENUE */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Core Metrics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black text-white font-mono">₹{metrics.totalRevenueInr.toLocaleString()}</p>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    +{metrics.revenueGrowthPercent}% this quarter
                  </span>
                </Card>

                <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly MRR</span>
                    <CreditCard className="w-4 h-4 text-teal-400" />
                  </div>
                  <p className="text-2xl font-black text-emerald-300 font-mono">₹{metrics.monthlyRecurringRevenue.toLocaleString()}</p>
                  <span className="text-[11px] font-semibold text-slate-400">1,120 Active Subscribers</span>
                </Card>

                <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-black text-white font-mono">{metrics.totalSubscribers.toLocaleString()}</p>
                  <span className="text-[11px] font-semibold text-emerald-400">+{metrics.customerGrowthPercent}% MoM Growth</span>
                </Card>

                <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orders Delivered</span>
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-black text-white font-mono">{metrics.ordersDelivered.toLocaleString()}</p>
                  <span className="text-[11px] font-semibold text-amber-300">{metrics.pendingOrders} Pending Fulfillment</span>
                </Card>
              </div>

              {/* Revenue & Growth Visual Bar Chart */}
              <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base">MRR Revenue & Subscriber Growth</h3>
                    <p className="text-xs text-slate-400">Monthly breakdown of gross revenue and active user growth.</p>
                  </div>
                  <Badge variant="emerald">H1 2026 Metrics</Badge>
                </div>

                <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6 border-b border-slate-800 pb-2 justify-around">
                  {revenueChartData.map((d) => {
                    const heightPct = Math.round((d.revenue / 360000) * 100);
                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full max-w-[48px] bg-slate-800 rounded-t-xl relative overflow-hidden flex items-end justify-center h-48">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPct}%` }}
                            transition={{ duration: 0.8 }}
                            className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl group-hover:from-emerald-500 group-hover:to-teal-300 transition-colors"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-300">{d.month}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-semibold">₹{(d.revenue / 1000).toFixed(0)}k</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-100 text-base">Registered Users & Subscribers ({filteredUsers.length})</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Subscription Tier</th>
                      <th className="py-3 px-4">Orders</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {paginatedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400 font-bold">{u.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-100">{u.name}</td>
                        <td className="py-3 px-4 text-slate-400">{u.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant="teal">{u.role}</Badge>
                        </td>
                        <td className="py-3 px-4 font-medium text-emerald-300">{u.subscriptionTier}</td>
                        <td className="py-3 px-4 font-mono">{u.ordersCount}</td>
                        <td className="py-3 px-4">
                          <Badge variant={u.status === 'Active' ? 'emerald' : u.status === 'Suspended' ? 'rose' : 'slate'}>
                            {u.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
                <span>Showing Page {currentPage} of {Math.ceil(filteredUsers.length / itemsPerPage) || 1}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="py-1 px-3 text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentPage * itemsPerPage >= filteredUsers.length}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="py-1 px-3 text-xs"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: ORDERS LOGISTICS */}
          {activeTab === 'orders' && (
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-100 text-base">Farm Produce Orders ({filteredOrders.length})</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Delivery Slot</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {paginatedOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">{o.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-100">{o.customerName}</td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{o.itemsSummary}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-100">₹{o.totalAmountInr}</td>
                        <td className="py-3 px-4 text-slate-400">{o.deliverySlot}</td>
                        <td className="py-3 px-4">
                          <Badge variant={o.status === 'Delivered' ? 'emerald' : o.status === 'Dispatched' ? 'amber' : 'slate'}>
                            {o.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                            className="bg-slate-950 text-[11px] text-slate-200 border border-slate-800 rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
                <span>Page {currentPage} of {Math.ceil(filteredOrders.length / itemsPerPage) || 1}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="py-1 px-3 text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentPage * itemsPerPage >= filteredOrders.length}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="py-1 px-3 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: SUBSCRIPTIONS MRR */}
          {activeTab === 'subscriptions' && (
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base">Subscriber MRR Overview</h3>
                  <p className="text-xs text-slate-400">Manage subscriber renewals and plan upgrades.</p>
                </div>
                <Badge variant="emerald">1,120 Active Members</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Subscribers</span>
                  <p className="text-xl font-extrabold text-white mt-1">740 Members</p>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Quarterly Pro</span>
                  <p className="text-xl font-extrabold text-teal-400 mt-1">260 Members</p>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Yearly VIP</span>
                  <p className="text-xl font-extrabold text-emerald-400 mt-1">120 Members</p>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 5: PRODUCE INVENTORY */}
          {activeTab === 'vegetables' && (
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-100 text-base">Farm Vegetables Catalog ({filteredVeggies.length})</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Veggie ID</th>
                      <th className="py-3 px-4">Produce Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Stock (kg)</th>
                      <th className="py-3 px-4">Price / kg</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {paginatedVeggies.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">{v.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-100">{v.name}</td>
                        <td className="py-3 px-4 text-slate-400">{v.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-200">{v.stockKg} kg</td>
                        <td className="py-3 px-4 font-mono text-emerald-300 font-bold">₹{v.pricePerKgInr}</td>
                        <td className="py-3 px-4">
                          <Badge variant={v.status === 'In Stock' ? 'emerald' : v.status === 'Low Stock' ? 'amber' : 'rose'}>
                            {v.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleVeggieStock(v.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-200 font-semibold"
                          >
                            Toggle Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB 6 & 7: RECIPES & MEAL PLANS */}
          {(activeTab === 'recipes' || activeTab === 'meal-plans') && (
            <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <h3 className="font-extrabold text-slate-100 text-base capitalize">{activeTab} Database Management</h3>
              <p className="text-xs text-slate-400">All recipe items and Indian meal plans are synchronized with Gemini AI & Recipe Catalog.</p>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-emerald-400 font-semibold">
                ✓ 24 active high-protein recipes published in Kshetriva Recipe Catalog.
              </div>
            </Card>
          )}

          {/* TAB 8: BROADCAST NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compose Broadcast Form */}
              <Card className="p-6 space-y-4 bg-slate-900/80 border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-slate-100 text-base">Send Subscriber Broadcast Alert</h3>
                </div>

                <form onSubmit={handleSendNotification} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Alert Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 🌿 Special Monsoon Harvest Offer"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Target Audience</label>
                    <select
                      value={notifTarget}
                      onChange={(e) => setNotifTarget(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="All Users">All Registered Users (1,248)</option>
                      <option value="Active Subscribers">Active Subscribers Only (1,120)</option>
                      <option value="VIP Members">VIP Annual Members Only (120)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Notification Message</label>
                    <textarea
                      rows={3}
                      placeholder="Type push message details..."
                      value={notifMessage}
                      onChange={(e) => setNotifMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <Button variant="primary" type="submit" className="w-full py-2.5 text-xs font-semibold">
                    <Send className="w-4 h-4 mr-1.5" /> Publish Broadcast
                  </Button>
                </form>
              </Card>

              {/* Sent Broadcast History */}
              <Card className="p-6 space-y-4 bg-slate-900/80 border-slate-800">
                <h3 className="font-extrabold text-slate-100 text-base">Broadcast Notification History</h3>
                <div className="space-y-3">
                  {notifsList.map((n) => (
                    <div key={n.id} className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-100">{n.title}</h4>
                        <Badge variant="teal">{n.targetAudience}</Badge>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-500 font-mono block pt-1">
                        Sent on {n.sentDate} • Delivered to {n.deliveredCount} devices
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
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
