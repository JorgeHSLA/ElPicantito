import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  notifications = computed(() => this.notificationService.getNotifications()());

  constructor(private notificationService: NotificationService) {}

  closeNotification(id: number) {
    this.notificationService.removeNotification(id);
  }
}
