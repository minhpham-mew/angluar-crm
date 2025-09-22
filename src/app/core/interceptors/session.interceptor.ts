import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';

import * as AuthActions from '../../auth/store/auth.actions';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle session expiration errors
      if (error.status === 401) {
        // Check if it's a session expiration error
        if (error.error?.type === 'general_unauthorized_scope' || error.error?.code === 401) {
          // Dispatch session expired action
          store.dispatch(AuthActions.sessionExpired());
        }
      }

      return throwError(() => error);
    }),
  );
};
