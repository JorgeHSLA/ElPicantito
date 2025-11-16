import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private nextId = 0;

  getNotifications() {
    return this.notifications;
  }

  showSuccess(message: string) {
    this.addNotification(message, 'success');
  }

  showError(message: string) {
    this.addNotification(message, 'error');
  }

  showWarning(message: string) {
    this.addNotification(message, 'warning');
  }

  showInfo(message: string) {
    this.addNotification(message, 'info');
  }

  private addNotification(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    const notification: Notification = {
      id: this.nextId++,
      message,
      type
    };

    this.notifications.update(notifications => [...notifications, notification]);

    // Auto-remover la notificación después de 3 segundos
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 3000);
  }

  removeNotification(id: number) {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }
}
