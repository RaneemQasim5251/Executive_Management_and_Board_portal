import { INotification } from '../contexts/AppStateProvider';

export class NotificationService {
  private static instance: NotificationService;
  private listeners: ((notification: INotification) => void)[] = [];

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Subscribe to notifications
  public subscribe(callback: (notification: INotification) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Emit notification to all subscribers
  public emit(notification: Omit<INotification, 'id' | 'timestamp'>): void {
    const fullNotification: INotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    this.listeners.forEach(listener => listener(fullNotification));
  }

  // Executive-level notifications
  public notifyExecutive(message: string, type: INotification['type'] = 'info', urgent = false): void {
    this.emit({
      title: urgent ? '🚨 Urgent Executive Alert' : '📊 Executive Update',
      message,
      type,
      urgent,
      read: false
    });
  }

  // Board meeting notifications
  public notifyBoardMeeting(message: string, urgent = false): void {
    this.emit({
      title: urgent ? '🚨 Urgent Board Alert' : '👥 Board Meeting',
      message,
      type: 'info',
      urgent,
      read: false
    });
  }

  // Strategic milestone notifications
  public notifyStrategicMilestone(message: string): void {
    this.emit({
      title: '🎯 Strategic Milestone',
      message,
      type: 'success',
      urgent: false,
      read: false
    });
  }

  // Financial alerts
  public notifyFinancialAlert(message: string, critical = false): void {
    this.emit({
      title: critical ? '⚠️ Critical Financial Alert' : '💰 Financial Update',
      message,
      type: critical ? 'error' : 'warning',
      urgent: critical,
      read: false
    });
  }

  // Project status notifications
  public notifyProjectStatus(projectName: string, status: string, type: INotification['type'] = 'info'): void {
    this.emit({
      title: '📋 Project Update',
      message: `${projectName}: ${status}`,
      type,
      urgent: type === 'error',
      read: false
    });
  }

  // System notifications
  public notifySystem(message: string, type: INotification['type'] = 'info'): void {
    this.emit({
      title: '🔧 System Notification',
      message,
      type,
      urgent: false,
      read: false
    });
  }

  // Browser notification support
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // Show browser notification
  public showBrowserNotification(notification: INotification): void {
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png', // Add your app icon
        badge: '/icon-72x72.png',
        tag: notification.id,
        requireInteraction: notification.urgent,
        silent: !notification.urgent
      });

      // Auto close after 5 seconds unless urgent
      if (!notification.urgent) {
        setTimeout(() => browserNotification.close(), 5000);
      }

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };
    }
  }

  // Demo data for testing
  public generateDemoNotifications(): INotification[] {
    return [
      {
        id: '1',
        title: '📊 Q4 Board Meeting',
        message: 'Quarterly review scheduled for tomorrow at 10 AM',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        urgent: false
      },
      {
        id: '2',
        title: '🎯 Strategic Initiative Update',
        message: 'Digital transformation project reached 75% completion',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        urgent: false
      },
      {
        id: '3',
        title: '⚠️ Budget Alert',
        message: 'Q4 expenses approaching 90% of allocated budget',
        type: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true,
        urgent: true
      },
      {
        id: '4',
        title: '💼 Investor Relations',
        message: 'Investor call scheduled for Friday - presentation ready for review',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        urgent: false
      }
    ];
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();