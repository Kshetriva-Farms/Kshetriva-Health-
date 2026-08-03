import {
  NotificationItem,
  NotificationPreferences,
  NotificationCategory,
} from '../../domain/entities/Notification';

const STORAGE_NOTIF_ITEMS = 'kshetriva_user_notifications';
const STORAGE_NOTIF_PREFS = 'kshetriva_notification_preferences';

class NotificationService {
  private getDefaultPreferences(): NotificationPreferences {
    return {
      inAppEnabled: true,
      pushEnabled: true,
      emailEnabled: true,
      categories: {
        water: true,
        exercise: true,
        mealLog: true,
        veggieDelivery: true,
        subscription: true,
        recipe: true,
      },
      scheduleTimes: {
        waterFrequencyHours: 2,
        exerciseTime: '07:30',
        mealLogBreakfastTime: '08:30',
        mealLogLunchTime: '13:00',
        mealLogDinnerTime: '20:00',
      },
    };
  }

  private getDefaultNotifications(): NotificationItem[] {
    const now = new Date();
    return [
      {
        id: 'n-1',
        category: 'WATER',
        title: '💧 Hydration Reminder',
        message: 'Time to drink 250ml of water! You have completed 1,750ml / 3,000ml today.',
        timestamp: new Date(now.getTime() - 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        actionUrl: '/water-tracker',
      },
      {
        id: 'n-2',
        category: 'VEGGIE_DELIVERY',
        title: '🥬 Vegetable Basket Dispatched',
        message: 'Your weekly organic farm basket #ORD-9082 is out for delivery with Express slot.',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        actionUrl: '/farm-basket',
      },
      {
        id: 'n-3',
        category: 'MEAL_LOG',
        title: '🥗 Lunch Meal Log Reminder',
        message: 'Don\'t forget to log your lunch calories to maintain your 400 kcal deficit.',
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        actionUrl: '/calorie-tracker',
      },
      {
        id: 'n-4',
        category: 'RECIPE',
        title: '🍲 Featured Farm Recipe',
        message: 'Try today\'s Palak Besan Chilla & Mint Chutney for high-protein breakfast!',
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        actionUrl: '/recipes',
      },
      {
        id: 'n-5',
        category: 'SUBSCRIPTION',
        title: '💳 Monthly Health+ Active',
        message: 'Your VIP Health+ subscription is active. Next renewal is on 2026-08-28.',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        actionUrl: '/subscription',
      },
    ];
  }

  getNotifications(): NotificationItem[] {
    if (typeof window === 'undefined') return this.getDefaultNotifications();
    try {
      const saved = localStorage.getItem(STORAGE_NOTIF_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
    const items = this.getDefaultNotifications();
    this.saveNotifications(items);
    return items;
  }

  saveNotifications(items: NotificationItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_NOTIF_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  }

  getPreferences(): NotificationPreferences {
    if (typeof window === 'undefined') return this.getDefaultPreferences();
    try {
      const saved = localStorage.getItem(STORAGE_NOTIF_PREFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading notification preferences:', e);
    }
    const prefs = this.getDefaultPreferences();
    this.savePreferences(prefs);
    return prefs;
  }

  savePreferences(prefs: NotificationPreferences): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_NOTIF_PREFS, JSON.stringify(prefs));
    } catch (e) {
      console.error('Error saving notification preferences:', e);
    }
  }

  markAsRead(id: string): NotificationItem[] {
    const current = this.getNotifications();
    const updated = current.map((item) => (item.id === id ? { ...item, isRead: true } : item));
    this.saveNotifications(updated);
    return updated;
  }

  markAllAsRead(): NotificationItem[] {
    const current = this.getNotifications();
    const updated = current.map((item) => ({ ...item, isRead: true }));
    this.saveNotifications(updated);
    return updated;
  }

  clearAll(): NotificationItem[] {
    this.saveNotifications([]);
    return [];
  }

  triggerTestNotification(category: NotificationCategory): NotificationItem[] {
    const templates: Record<NotificationCategory, { title: string; message: string; actionUrl: string }> = {
      WATER: {
        title: '💧 Drink Water Reminder',
        message: 'Stay hydrated! Take a 250ml glass of fresh organic water now.',
        actionUrl: '/water-tracker',
      },
      EXERCISE: {
        title: '🏋️ Workout & Activity Goal',
        message: 'Time for your 30-minute brisk walk or core workout session!',
        actionUrl: '/vitals',
      },
      MEAL_LOG: {
        title: '🥗 Log Your Meals',
        message: 'Log your recent meal ingredients in Kshetriva Calorie Tracker.',
        actionUrl: '/calorie-tracker',
      },
      VEGGIE_DELIVERY: {
        title: '🥬 Vegetable Basket Update',
        message: 'Your organic farm harvest basket has been packed and scheduled for delivery.',
        actionUrl: '/farm-basket',
      },
      SUBSCRIPTION: {
        title: '💳 Subscription Renewal Alert',
        message: 'Your Monthly Health+ subscription will auto-renew in 3 days.',
        actionUrl: '/subscription',
      },
      RECIPE: {
        title: '🍲 New Farm Recipe Available',
        message: 'Check out today\'s Desi Paneer & Farm Broccoli Kadai recipe!',
        actionUrl: '/recipes',
      },
    };

    const template = templates[category];
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      category,
      title: template.title,
      message: template.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      actionUrl: template.actionUrl,
    };

    const current = this.getNotifications();
    const updated = [newNotif, ...current];
    this.saveNotifications(updated);
    return updated;
  }
}

export const notificationService = new NotificationService();
