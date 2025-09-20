import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../core/models';
import * as AuthActions from './auth.actions';

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  })),
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  })),
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Load current user
  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  })),
  // Signup actions
  on(AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.signupSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  })),
  // Session management actions
  on(AuthActions.checkSession, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.sessionValid, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  on(AuthActions.sessionInvalid, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  })),
  on(AuthActions.sessionExpired, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: 'Session expired'
  })),
  on(AuthActions.refreshSession, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.refreshSessionSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  on(AuthActions.refreshSessionFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  })),
  // Clear auth state
  on(AuthActions.clearAuthState, () => initialState)
);
