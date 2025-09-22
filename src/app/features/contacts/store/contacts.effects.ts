import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap, withLatestFrom } from 'rxjs/operators';

import { selectUserTenantId } from '../../../auth/store/auth.selectors';
import { AppwriteService } from '../../../core/services/appwrite.service';
import * as NotificationsActions from '../../../shared/store/notifications/notifications.actions';
import * as ContactsActions from './contacts.actions';

@Injectable()
export class ContactsEffects {
  private actions$ = inject(Actions);
  private appwriteService = inject(AppwriteService);
  private store = inject(Store);

  loadContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactsActions.loadContacts),
      withLatestFrom(this.store.select(selectUserTenantId)),
      exhaustMap(([action, tenantId]) => {
        if (!tenantId) {
          return of(ContactsActions.loadContactsFailure({ error: 'No tenant ID available' }));
        }

        return this.appwriteService
          .getContacts(tenantId)
          .then((contacts) => ContactsActions.loadContactsSuccess({ contacts }))
          .catch((error) => ContactsActions.loadContactsFailure({ error: error.message }));
      }),
    ),
  );

  createContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactsActions.createContact),
      exhaustMap(({ contact }) =>
        this.appwriteService
          .createContact(contact)
          .then((newContact) => ContactsActions.createContactSuccess({ contact: newContact }))
          .catch((error) => ContactsActions.createContactFailure({ error: error.message })),
      ),
    ),
  );

  createContactSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactsActions.createContactSuccess),
        tap(() => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: 'Contact created successfully!', type: 'success' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  createContactFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactsActions.createContactFailure),
        tap(({ error }) => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: `Error creating contact: ${error}`, type: 'error' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  updateContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactsActions.updateContact),
      exhaustMap(({ id, changes }) =>
        this.appwriteService
          .updateContact(id, changes)
          .then((contact) => ContactsActions.updateContactSuccess({ contact }))
          .catch((error) => ContactsActions.updateContactFailure({ error: error.message })),
      ),
    ),
  );

  updateContactSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactsActions.updateContactSuccess),
        tap(() => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: 'Contact updated successfully!', type: 'success' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  updateContactFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactsActions.updateContactFailure),
        tap(({ error }) => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: `Error updating contact: ${error}`, type: 'error' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  deleteContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactsActions.deleteContact),
      exhaustMap(({ id }) =>
        this.appwriteService
          .deleteContact(id)
          .then(() => ContactsActions.deleteContactSuccess({ id }))
          .catch((error) => ContactsActions.deleteContactFailure({ error: error.message })),
      ),
    ),
  );

  deleteContactSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactsActions.deleteContactSuccess),
        tap(() => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: 'Contact deleted successfully!', type: 'success' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  deleteContactFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactsActions.deleteContactFailure),
        tap(({ error }) => {
          this.store.dispatch(
            NotificationsActions.addNotification({
              notification: { message: `Error deleting contact: ${error}`, type: 'error' },
            }),
          );
        }),
      ),
    { dispatch: false },
  );
}
