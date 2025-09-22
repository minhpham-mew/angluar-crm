import { createAction, props } from '@ngrx/store';

import { User } from '../../core/models';

// Login actions
export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());

export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User }>());

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

// Logout actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: string }>());

// Load current user
export const loadCurrentUser = createAction('[Auth] Load Current User');

export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: User }>(),
);

export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: string | null }>(),
);

// Signup actions
export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string; companyName: string }>(),
);

export const signupSuccess = createAction('[Auth] Signup Success', props<{ user: User }>());

export const signupFailure = createAction('[Auth] Signup Failure', props<{ error: string }>());

// Session management actions
export const checkSession = createAction('[Auth] Check Session');

export const sessionValid = createAction('[Auth] Session Valid', props<{ user: User }>());

export const sessionInvalid = createAction('[Auth] Session Invalid');

export const sessionExpired = createAction('[Auth] Session Expired');

export const refreshSession = createAction('[Auth] Refresh Session');

export const refreshSessionSuccess = createAction(
  '[Auth] Refresh Session Success',
  props<{ user: User }>(),
);

export const refreshSessionFailure = createAction(
  '[Auth] Refresh Session Failure',
  props<{ error: string }>(),
);

// Clear auth state
export const clearAuthState = createAction('[Auth] Clear Auth State');
