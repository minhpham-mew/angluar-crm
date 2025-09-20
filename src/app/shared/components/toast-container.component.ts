import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { ToastModule } from 'primeng/toast';

import { selectAllNotifications } from '../store/notifications/notifications.selectors';
import * as NotificationsActions from '../store/notifications/notifications.actions';
import { Notification } from '../../core/models';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule, ToastModule],
  templateUrl: './toast-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class ToastContainerComponent implements OnInit {
  private store = inject(Store);
  private messageService = inject(MessageService);

  notifications$ = this.store.select(selectAllNotifications);

  ngOnInit() {
    // Subscribe to notifications and show them using PrimeNG Toast
    this.notifications$.subscribe(notifications => {
      notifications.forEach(notification => {
        this.messageService.add({
          severity: this.mapNotificationTypeToPrimeSeverity(notification.type),
          summary: this.getNotificationTitle(notification.type),
          detail: notification.message,
          life: notification.duration || 5000,
          key: notification.id
        });

        // Remove from store after showing
        setTimeout(() => {
          this.store.dispatch(NotificationsActions.removeNotification({ id: notification.id }));
        }, notification.duration || 5000);
      });
    });
  }

  private mapNotificationTypeToPrimeSeverity(type: string): 'success' | 'info' | 'warn' | 'error' {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warn';
      case 'info':
      default:
        return 'info';
    }
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Information';
    }
  }
}
