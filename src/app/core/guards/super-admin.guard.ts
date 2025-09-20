import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectUserRole, selectIsAuthenticated } from '../../auth/store/auth.selectors';
import { combineLatest } from 'rxjs';

export const superAdminGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([
    store.select(selectIsAuthenticated),
    store.select(selectUserRole)
  ]).pipe(
    take(1),
    map(([isAuthenticated, userRole]) => {
      if (isAuthenticated && userRole === 'super_admin') {
        return true;
      } else {
        router.navigate(['/dashboard']);
        return false;
      }
    })
  );
};
