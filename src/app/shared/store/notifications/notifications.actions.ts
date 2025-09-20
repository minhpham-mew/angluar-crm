import { createAction, props } from '@ngrx/store';
import { Notification } from '../../../core/models';

export const addNotification = createAction(
  '[Notifications] Add Notification',
  props<{ notification: Omit<Notification, 'id'> }>()
);

export const removeNotification = createAction(
  '[Notifications] Remove Notification',
  props<{ id: string }>()
);

export const clearAllNotifications = createAction(
  '[Notifications] Clear All Notifications'
);
