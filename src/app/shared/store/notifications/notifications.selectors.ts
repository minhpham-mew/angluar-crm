import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NotificationsState } from '../../../core/models';

export const selectNotificationsState = createFeatureSelector<NotificationsState>('notifications');

export const selectAllNotifications = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.notifications,
);

export const selectNotificationById = (id: string) =>
  createSelector(selectAllNotifications, (notifications) =>
    notifications.find((notification) => notification.id === id),
  );
