import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import { User, UserPrefs } from '../../core/models';
import { AppwriteService } from '../../core/services/appwrite.service';
import * as NotificationsActions from '../../shared/store/notifications/notifications.actions';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private appwriteService = inject(AppwriteService);
  private router = inject(Router);
  private store = inject(Store);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.appwriteService
          .login(email, password)
          .then(async (session) => {
            const appwriteUser = await this.appwriteService.getCurrentUser();
            const prefs = (await this.appwriteService.getUserPrefs()) as unknown as UserPrefs;

            const user: User = {
              $id: appwriteUser.$id,
              email: appwriteUser.email,
              name: appwriteUser.name,
              tenantId: prefs.tenantId,
              role: prefs.role,
              permissions: prefs.permissions,
              $createdAt: appwriteUser.$createdAt,
              $updatedAt: appwriteUser.$updatedAt,
            };

            return AuthActions.loginSuccess({ user });
          })
          .catch((error) => {
            return AuthActions.loginFailure({ error: error.message });
          }),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']);
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: 'Login successful!', type: 'success' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: `Login failed: ${error}`, type: 'error' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.appwriteService
          .logout()
          .then(() => {
            return AuthActions.logoutSuccess();
          })
          .catch((error) => {
            return AuthActions.logoutFailure({ error: error.message });
          }),
      ),
    ),
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: 'Logout successful!', type: 'success' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      exhaustMap(() =>
        this.appwriteService
          .getCurrentUser()
          .then(async (appwriteUser) => {
            const prefs = (await this.appwriteService.getUserPrefs()) as unknown as UserPrefs;

            const user: User = {
              $id: appwriteUser.$id,
              email: appwriteUser.email,
              name: appwriteUser.name,
              tenantId: prefs.tenantId,
              role: prefs.role,
              permissions: prefs.permissions,
              $createdAt: appwriteUser.$createdAt,
              $updatedAt: appwriteUser.$updatedAt,
            };

            return AuthActions.loadCurrentUserSuccess({ user });
          })
          .catch((error) => {
            // If user is not authenticated (401 error), don't show error notification
            // Just silently fail and let the auth guard redirect to login
            if (error.code === 401 || error.type === 'general_unauthorized_scope') {
              return AuthActions.loadCurrentUserFailure({ error: null });
            }
            return AuthActions.loadCurrentUserFailure({ error: error.message });
          }),
      ),
    ),
  );

  loadCurrentUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loadCurrentUserFailure),
        tap(({ error }) => {
          // Only show error notification if there's an actual error message
          // Don't show notification for authentication failures (user not logged in)
          if (error) {
            this.store.dispatch(
              NotificationsActions.addNotification({
                notification: { message: `Failed to load user: ${error}`, type: 'error' },
              }),
            );
          }
        }),
      ),
    { dispatch: false },
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      exhaustMap(({ name, email, password, companyName }) =>
        this.appwriteService
          .signup(name, email, password, companyName)
          .then(async (appwriteUser) => {
            const prefs = (await this.appwriteService.getUserPrefs()) as unknown as UserPrefs;

            const user: User = {
              $id: appwriteUser.$id,
              email: appwriteUser.email,
              name: appwriteUser.name,
              tenantId: prefs.tenantId,
              role: prefs.role,
              permissions: prefs.permissions,
              $createdAt: appwriteUser.$createdAt,
              $updatedAt: appwriteUser.$updatedAt,
            };

            return AuthActions.signupSuccess({ user });
          })
          .catch((error) => {
            return AuthActions.signupFailure({ error: error.message });
          }),
      ),
    ),
  );

  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']);
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: {
                message: 'Account created successfully! Welcome to your CRM!',
                type: 'success',
              },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  signupFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupFailure),
        tap(({ error }) => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: `Signup failed: ${error}`, type: 'error' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  // Session management effects
  checkSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkSession),
      exhaustMap(() =>
        this.appwriteService
          .hasActiveSession()
          .then(async (hasSession) => {
            if (hasSession) {
              try {
                const appwriteUser = await this.appwriteService.getCurrentUser();
                const prefs = (await this.appwriteService.getUserPrefs()) as unknown as UserPrefs;

                const user: User = {
                  $id: appwriteUser.$id,
                  email: appwriteUser.email,
                  name: appwriteUser.name,
                  tenantId: prefs.tenantId,
                  role: prefs.role,
                  permissions: prefs.permissions,
                  $createdAt: appwriteUser.$createdAt,
                  $updatedAt: appwriteUser.$updatedAt,
                };

                return AuthActions.sessionValid({ user });
              } catch (error) {
                return AuthActions.sessionInvalid();
              }
            } else {
              return AuthActions.sessionInvalid();
            }
          })
          .catch(() => {
            return AuthActions.sessionInvalid();
          }),
      ),
    ),
  );

  sessionValid$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sessionValid),
        tap(() => {
          // Session is valid, user is authenticated
          console.log('Session is valid, user authenticated');
        }),
      ),
    { dispatch: false },
  );

  sessionInvalid$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sessionInvalid),
        tap(() => {
          // Session is invalid - don't redirect here, let the auth guard handle it
          // This prevents race conditions during page refresh
          console.log('Session invalid - auth guard will handle redirect');
        }),
      ),
    { dispatch: false },
  );

  sessionExpired$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sessionExpired),
        tap(() => {
          this.router.navigate(['/login']);
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: {
                message: 'Your session has expired. Please sign in again.',
                type: 'warning',
              },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  refreshSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshSession),
      exhaustMap(() =>
        this.appwriteService
          .getCurrentUser()
          .then(async (appwriteUser) => {
            const prefs = (await this.appwriteService.getUserPrefs()) as unknown as UserPrefs;

            const user: User = {
              $id: appwriteUser.$id,
              email: appwriteUser.email,
              name: appwriteUser.name,
              tenantId: prefs.tenantId,
              role: prefs.role,
              permissions: prefs.permissions,
              $createdAt: appwriteUser.$createdAt,
              $updatedAt: appwriteUser.$updatedAt,
            };

            return AuthActions.refreshSessionSuccess({ user });
          })
          .catch((error) => {
            return AuthActions.refreshSessionFailure({ error: error.message });
          }),
      ),
    ),
  );

  refreshSessionFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshSessionFailure),
        tap(() => {
          this.store.dispatch(AuthActions.sessionExpired());
        }),
      ),
    { dispatch: false },
  );
}
