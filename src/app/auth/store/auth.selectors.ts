import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../core/models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUserRole = createSelector(
  selectCurrentUser,
  (user) => user?.role
);

export const selectUserTenantId = createSelector(
  selectCurrentUser,
  (user) => user?.tenantId
);

export const selectUserPermissions = createSelector(
  selectCurrentUser,
  (user) => user?.permissions || []
);
