import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap, withLatestFrom } from 'rxjs/operators';

import { selectUserTenantId } from '../../../auth/store/auth.selectors';
import { AppwriteService } from '../../../core/services/appwrite.service';
import * as NotificationsActions from '../../../shared/store/notifications/notifications.actions';
import * as MeetingsActions from './meetings.actions';

@Injectable()
export class MeetingsEffects {
  private actions$ = inject(Actions);
  private appwriteService = inject(AppwriteService);
  private store = inject(Store);

  loadMeetings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.loadMeetings),
      withLatestFrom(this.store.select(selectUserTenantId)),
      exhaustMap(([action, tenantId]) => {
        if (!tenantId) {
          return of(MeetingsActions.loadMeetingsFailure({ error: 'No tenant ID available' }));
        }

        return this.appwriteService
          .getMeetings(tenantId)
          .then((meetings) => MeetingsActions.loadMeetingsSuccess({ meetings }))
          .catch((error) => MeetingsActions.loadMeetingsFailure({ error: error.message }));
      }),
    ),
  );

  createMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.createMeeting),
      exhaustMap(({ meeting }) =>
        this.appwriteService
          .createMeeting(meeting)
          .then((newMeeting) => MeetingsActions.createMeetingSuccess({ meeting: newMeeting }))
          .catch((error) => MeetingsActions.createMeetingFailure({ error: error.message })),
      ),
    ),
  );

  createMeetingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.createMeetingSuccess),
        tap(() => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: 'Meeting created successfully!', type: 'success' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  createMeetingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.createMeetingFailure),
        tap(({ error }) => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: `Error creating meeting: ${error}`, type: 'error' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  updateMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.updateMeeting),
      exhaustMap(({ id, changes }) =>
        this.appwriteService
          .updateMeeting(id, changes)
          .then((meeting) => MeetingsActions.updateMeetingSuccess({ meeting }))
          .catch((error) => MeetingsActions.updateMeetingFailure({ error: error.message })),
      ),
    ),
  );

  updateMeetingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.updateMeetingSuccess),
        tap(() => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: 'Meeting updated successfully!', type: 'success' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  updateMeetingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.updateMeetingFailure),
        tap(({ error }) => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: `Error updating meeting: ${error}`, type: 'error' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  deleteMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.deleteMeeting),
      exhaustMap(({ id }) =>
        this.appwriteService
          .deleteMeeting(id)
          .then(() => MeetingsActions.deleteMeetingSuccess({ id }))
          .catch((error) => MeetingsActions.deleteMeetingFailure({ error: error.message })),
      ),
    ),
  );

  deleteMeetingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.deleteMeetingSuccess),
        tap(() => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: 'Meeting deleted successfully!', type: 'success' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  deleteMeetingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.deleteMeetingFailure),
        tap(({ error }) => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: `Error deleting meeting: ${error}`, type: 'error' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );
}
