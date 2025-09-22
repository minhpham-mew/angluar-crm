import { createFeatureSelector, createSelector } from '@ngrx/store';

import { contactsAdapter, ContactsEntityState } from './contacts.reducer';

export const selectContactsState = createFeatureSelector<ContactsEntityState>('contacts');

const { selectIds, selectEntities, selectAll, selectTotal } = contactsAdapter.getSelectors();

export const selectContactIds = createSelector(selectContactsState, selectIds);
export const selectContactEntities = createSelector(selectContactsState, selectEntities);
export const selectAllContacts = createSelector(selectContactsState, selectAll);
export const selectContactsTotal = createSelector(selectContactsState, selectTotal);

export const selectContactsLoading = createSelector(selectContactsState, (state) => state.loading);

export const selectContactsError = createSelector(selectContactsState, (state) => state.error);

export const selectContactsSearchTerm = createSelector(
  selectContactsState,
  (state) => state.searchTerm,
);

export const selectFilteredContacts = createSelector(
  selectAllContacts,
  selectContactsSearchTerm,
  (contacts, searchTerm) => {
    if (!searchTerm) {
      return contacts;
    }
    const term = searchTerm.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.firstName.toLowerCase().includes(term) ||
        contact.lastName.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        (contact.company && contact.company.toLowerCase().includes(term)),
    );
  },
);

export const selectContactById = (id: string) =>
  createSelector(selectContactEntities, (entities) => entities[id]);

export const selectRecentContacts = createSelector(selectAllContacts, (contacts) =>
  contacts
    .sort((a, b) => new Date(b.$createdAt || '').getTime() - new Date(a.$createdAt || '').getTime())
    .slice(0, 5),
);
