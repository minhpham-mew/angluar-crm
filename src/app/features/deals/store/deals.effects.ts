import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { AppwriteService } from '../../../core/services/appwrite.service';
import { selectUserTenantId } from '../../../auth/store/auth.selectors';
import * as DealsActions from './deals.actions';
import * as NotificationsActions from '../../../shared/store/notifications/notifications.actions';

@Injectable()
export class DealsEffects {
  private actions$ = inject(Actions);
  private appwriteService = inject(AppwriteService);
  private store = inject(Store);

  loadDeals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.loadDeals),
      withLatestFrom(this.store.select(selectUserTenantId)),
      exhaustMap(([action, tenantId]) => {
        if (!tenantId) {
          return of(DealsActions.loadDealsFailure({ error: 'No tenant ID available' }));
        }
        
        return this.appwriteService.getDeals(tenantId).then(
          (deals) => DealsActions.loadDealsSuccess({ deals })
        ).catch(
          (error) => DealsActions.loadDealsFailure({ error: error.message })
        );
      })
    )
  );

  createDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.createDeal),
      exhaustMap(({ deal }) =>
        this.appwriteService.createDeal(deal).then(
          (newDeal) => DealsActions.createDealSuccess({ deal: newDeal })
        ).catch(
          (error) => DealsActions.createDealFailure({ error: error.message })
        )
      )
    )
  );

  createDealSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.createDealSuccess),
      tap(() => {
        this.store.dispatch(NotificationsActions.addNotification({
          notification: { message: 'Deal created successfully!', type: 'success' }
        }));
      })
    ),
    { dispatch: false }
  );

  createDealFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.createDealFailure),
      tap(({ error }) => {
        this.store.dispatch(NotificationsActions.addNotification({
          notification: { message: `Error creating deal: ${error}`, type: 'error' }
        }));
      })
    ),
    { dispatch: false }
  );

  updateDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.updateDeal),
      exhaustMap(({ id, changes }) =>
        this.appwriteService.updateDeal(id, changes).then(
          (deal) => DealsActions.updateDealSuccess({ deal })
        ).catch(
          (error) => DealsActions.updateDealFailure({ error: error.message })
        )
      )
    )
  );

  updateDealSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.updateDealSuccess),
      tap(() => {
        this.store.dispatch(NotificationsActions.addNotification({
          notification: { message: 'Deal updated successfully!', type: 'success' }
        }));
      })
    ),
    { dispatch: false }
  );

  updateDealFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.updateDealFailure),
      tap(({ error }) => {
        this.store.dispatch(NotificationsActions.addNotification({
          notification: { message: `Error updating deal: ${error}`, type: 'error' }
        }));
      })
    ),
    { dispatch: false }
  );

  deleteDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.deleteDeal),
      exhaustMap(({ id }) =>
        this.appwriteService.deleteDeal(id).then(
          () => DealsActions.deleteDealSuccess({ id })
        ).catch(
          (error) => DealsActions.deleteDealFailure({ error: error.message })
        )
      )
    )
  );

  deleteDealSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.deleteDealSuccess),
      tap(() => {
        this.store.dispatch(NotificationsActions.addNotification({
          notification: { message: 'Deal deleted successfully!', type: 'success' }
        }));
      })
    ),
    { dispatch: false }
  );

  deleteDealFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.deleteDealFailure),
      tap(({ error }) => {
        this.store.dispatch(NotificationsActions.addNotification({
          notification: { message: `Error deleting deal: ${error}`, type: 'error' }
        }));
      })
    ),
    { dispatch: false }
  );
}
