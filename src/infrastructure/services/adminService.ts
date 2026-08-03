import {
  AdminMetrics,
  AdminUserRecord,
  AdminOrderRecord,
  AdminVegetableRecord,
  AdminBroadcastNotification,
} from '../../domain/entities/Admin';

const STORAGE_USERS = 'kshetriva_admin_users';
const STORAGE_ORDERS = 'kshetriva_admin_orders';
const STORAGE_VEGGIES = 'kshetriva_admin_veggies';
const STORAGE_NOTIFS = 'kshetriva_admin_notifs';

class AdminService {
  getMetrics(): AdminMetrics {
    return {
      totalRevenueInr: 1425000,
      monthlyRecurringRevenue: 349900,
      totalSubscribers: 1248,
      activeSubscribers: 1120,
      ordersDelivered: 3890,
      pendingOrders: 42,
      customerGrowthPercent: 24.5,
      revenueGrowthPercent: 18.2,
    };
  }

  getRevenueChartData() {
    return [
      { month: 'Jan', revenue: 185000, customers: 820 },
      { month: 'Feb', revenue: 210000, customers: 910 },
      { month: 'Mar', revenue: 245000, customers: 990 },
      { month: 'Apr', revenue: 280000, customers: 1050 },
      { month: 'May', revenue: 315000, customers: 1140 },
      { month: 'Jun', revenue: 349900, customers: 1248 },
    ];
  }

  getUsers(): AdminUserRecord[] {
    if (typeof window === 'undefined') return this.getDefaultUsers();
    try {
      const saved = localStorage.getItem(STORAGE_USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const users = this.getDefaultUsers();
    this.saveUsers(users);
    return users;
  }

  saveUsers(users: AdminUserRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    } catch (e) {}
  }

  getOrders(): AdminOrderRecord[] {
    if (typeof window === 'undefined') return this.getDefaultOrders();
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const orders = this.getDefaultOrders();
    this.saveOrders(orders);
    return orders;
  }

  saveOrders(orders: AdminOrderRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    } catch (e) {}
  }

  getVegetables(): AdminVegetableRecord[] {
    if (typeof window === 'undefined') return this.getDefaultVegetables();
    try {
      const saved = localStorage.getItem(STORAGE_VEGGIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const veggies = this.getDefaultVegetables();
    this.saveVegetables(veggies);
    return veggies;
  }

  saveVegetables(veggies: AdminVegetableRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_VEGGIES, JSON.stringify(veggies));
    } catch (e) {}
  }

  getNotifications(): AdminBroadcastNotification[] {
    if (typeof window === 'undefined') return this.getDefaultNotifications();
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const notifs = this.getDefaultNotifications();
    this.saveNotifications(notifs);
    return notifs;
  }

  saveNotifications(notifs: AdminBroadcastNotification[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_NOTIFS, JSON.stringify(notifs));
    } catch (e) {}
  }

  sendBroadcastNotification(title: string, message: string, target: 'All Users' | 'Active Subscribers' | 'VIP Members'): AdminBroadcastNotification[] {
    const newNotif: AdminBroadcastNotification = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      targetAudience: target,
      sentDate: new Date().toISOString().split('T')[0],
      deliveredCount: target === 'All Users' ? 1248 : target === 'Active Subscribers' ? 1120 : 340,
    };
    const current = this.getNotifications();
    const updated = [newNotif, ...current];
    this.saveNotifications(updated);
    return updated;
  }

  exportReportCSV(dataName: string, items: any[]): void {
    if (!items || items.length === 0) return;
    const keys = Object.keys(items[0]);
    const csvRows = [
      keys.join(','),
      ...items.map((row) => keys.map((k) => JSON.stringify(row[k] ?? '')).join(',')),
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kshetriva-${dataName.toLowerCase()}-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private getDefaultUsers(): AdminUserRecord[] {
    return [
      { id: 'USR-101', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Subscriber', subscriptionTier: 'Monthly Health+', status: 'Active', joinedDate: '2026-01-12', ordersCount: 14 },
      { id: 'USR-102', name: 'Priya Patel', email: 'priya@example.com', role: 'Subscriber', subscriptionTier: 'Yearly VIP', status: 'Active', joinedDate: '2026-02-04', ordersCount: 28 },
      { id: 'USR-103', name: 'Rohan Mehta', email: 'rohan@example.com', role: 'User', subscriptionTier: 'Weekly Basket', status: 'Active', joinedDate: '2026-03-19', ordersCount: 6 },
      { id: 'USR-104', name: 'Ananya Gupta', email: 'ananya@example.com', role: 'Subscriber', subscriptionTier: 'Quarterly Pro', status: 'Active', joinedDate: '2026-04-01', ordersCount: 18 },
      { id: 'USR-105', name: 'Vikram Singh', email: 'vikram@example.com', role: 'User', subscriptionTier: 'None', status: 'Inactive', joinedDate: '2026-05-15', ordersCount: 2 },
      { id: 'USR-106', name: 'Kavita Reddy', email: 'kavita@example.com', role: 'Subscriber', subscriptionTier: 'Monthly Health+', status: 'Active', joinedDate: '2026-06-08', ordersCount: 10 },
      { id: 'USR-107', name: 'Kabir Joshi', email: 'kabir@example.com', role: 'User', subscriptionTier: 'Weekly Basket', status: 'Suspended', joinedDate: '2026-06-20', ordersCount: 4 },
    ];
  }

  private getDefaultOrders(): AdminOrderRecord[] {
    return [
      { id: 'ORD-9081', customerName: 'Aarav Sharma', email: 'aarav@example.com', itemsSummary: 'Spinach, Broccoli, Carrot, Paneer', totalAmountInr: 850, orderDate: '2026-07-28', status: 'Delivered', deliverySlot: 'Morning 8:00 AM' },
      { id: 'ORD-9082', customerName: 'Priya Patel', email: 'priya@example.com', itemsSummary: 'Palak, Moong Dal, Bell Peppers, Ghee', totalAmountInr: 1250, orderDate: '2026-07-28', status: 'Dispatched', deliverySlot: 'Evening 5:00 PM' },
      { id: 'ORD-9083', customerName: 'Ananya Gupta', email: 'ananya@example.com', itemsSummary: 'Heritage Carrots, Mint, Chia Seeds', totalAmountInr: 620, orderDate: '2026-07-29', status: 'Pending', deliverySlot: 'Morning 9:30 AM' },
      { id: 'ORD-9084', customerName: 'Rohan Mehta', email: 'rohan@example.com', itemsSummary: 'Sprouts, Cucumber, Paneer, Tomatoes', totalAmountInr: 940, orderDate: '2026-07-29', status: 'Pending', deliverySlot: 'Afternoon 1:00 PM' },
      { id: 'ORD-9085', customerName: 'Kavita Reddy', email: 'kavita@example.com', itemsSummary: 'Organic Spinach, Sweet Potato, Tofu', totalAmountInr: 780, orderDate: '2026-07-27', status: 'Delivered', deliverySlot: 'Morning 8:00 AM' },
    ];
  }

  private getDefaultVegetables(): AdminVegetableRecord[] {
    return [
      { id: 'VEG-01', name: 'Heritage Spinach (Palak)', category: 'Leafy Greens', stockKg: 120, pricePerKgInr: 60, isOrganic: true, harvestDate: '2026-07-28', status: 'In Stock' },
      { id: 'VEG-02', name: 'Fresh Farm Broccoli', category: 'Leafy Greens', stockKg: 45, pricePerKgInr: 120, isOrganic: true, harvestDate: '2026-07-27', status: 'In Stock' },
      { id: 'VEG-03', name: 'Desi Orange Carrots', category: 'Root Veggies', stockKg: 15, pricePerKgInr: 45, isOrganic: true, harvestDate: '2026-07-26', status: 'Low Stock' },
      { id: 'VEG-04', name: 'Trichy Red Bell Peppers', category: 'Herbs & Seasoning', stockKg: 0, pricePerKgInr: 140, isOrganic: true, harvestDate: '2026-07-25', status: 'Out of Stock' },
      { id: 'VEG-05', name: 'Pudina Mint Leaves', category: 'Herbs & Seasoning', stockKg: 80, pricePerKgInr: 50, isOrganic: true, harvestDate: '2026-07-29', status: 'In Stock' },
    ];
  }

  private getDefaultNotifications(): AdminBroadcastNotification[] {
    return [
      { id: 'NOTIF-101', title: '🌿 Monsoon Harvest Discount Alert', message: 'Enjoy 20% OFF on all organic vegetable baskets this week!', targetAudience: 'All Users', sentDate: '2026-07-25', deliveredCount: 1248 },
      { id: 'NOTIF-102', title: '⭐ Gemini AI 2.5 Coach Updated', message: 'Ask Dr. Health+ personalized calorie deficit & high protein tips now.', targetAudience: 'Active Subscribers', sentDate: '2026-07-20', deliveredCount: 1120 },
    ];
  }
}

export const adminService = new AdminService();
