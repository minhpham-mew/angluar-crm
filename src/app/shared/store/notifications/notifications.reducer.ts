import { createReducer, on } from '@ngrx/store';

import { NotificationsState } from '../../../core/models';
import * as NotificationsActions from './notifications.actions';

export const initialState: NotificationsState = {
  notifications: [],
};

export const notificationsReducer = createReducer(
  initialState,
  on(NotificationsActions.addNotification, (state, { notification }) => ({
    ...state,
    notifications: [
      ...state.notifications,
      {
        ...notification,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      },
    ],
  })),
  on(NotificationsActions.removeNotification, (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter((notification) => notification.id !== id),
  })),
  on(NotificationsActions.clearAllNotifications, (state) => ({
    ...state,
    notifications: [],
  })),
);
