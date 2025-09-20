import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, switchMap, timeout, catchError, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectIsAuthenticated, selectCurrentUser } from '../../auth/store/auth.selectors';
import { AppwriteService } from '../services/appwrite.service';
import * as AuthActions from '../../auth/store/auth.actions';

export const authGuard = () => {
  const store = inject(Store);
  const router = inject(Router);
  const appwriteService = inject(AppwriteService);

  // Check current authentication state and user data
  return store.select(selectCurrentUser).pipe(
    take(1),
    switchMap(user => {
      // If already authenticated and has tenant ID, allow access
      if (user && user.tenantId) {
        return of(true);
      }

      // If not authenticated, check for valid session and load user data
      return appwriteService.hasActiveSession().then(async (hasSession) => {
        if (hasSession) {
          try {
            // Valid session exists, load user data including tenant ID
            const appwriteUser = await appwriteService.getCurrentUser();
            const prefs = await appwriteService.getUserPrefs() as any;
            
            // Ensure tenant ID is available
            if (!prefs.tenantId) {
              console.error('Tenant ID not found in user preferences');
              router.navigate(['/login']);
              return false;
            }
            
            // Dispatch session valid action with user data
            store.dispatch(AuthActions.sessionValid({ 
              user: {
                $id: appwriteUser.$id,
                email: appwriteUser.email,
                name: appwriteUser.name,
                tenantId: prefs.tenantId,
                role: prefs.role,
                permissions: prefs.permissions,
                $createdAt: appwriteUser.$createdAt,
                $updatedAt: appwriteUser.$updatedAt
              }
            }));
            
            return true;
          } catch (error) {
            console.error('Error loading user data:', error);
            router.navigate(['/login']);
            return false;
          }
        } else {
          // No valid session, redirect to login
          router.navigate(['/login']);
          return false;
        }
      }).catch(() => {
        // Error checking session, redirect to login
        router.navigate(['/login']);
        return false;
      });
    }),
    // Add timeout protection
    timeout(3000),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
