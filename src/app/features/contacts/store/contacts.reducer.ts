import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Contact, ContactsState } from '../../../core/models';
import * as ContactsActions from './contacts.actions';

export interface ContactsEntityState extends EntityState<Contact> {
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const contactsAdapter: EntityAdapter<Contact> = createEntityAdapter<Contact>({
  selectId: (contact: Contact) => contact.$id,
});

export const initialState: ContactsEntityState = contactsAdapter.getInitialState({
  loading: false,
  error: null,
  searchTerm: ''
});

export const contactsReducer = createReducer(
  initialState,
  // Load contacts
  on(ContactsActions.loadContacts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ContactsActions.loadContactsSuccess, (state, { contacts }) =>
    contactsAdapter.setAll(contacts, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(ContactsActions.loadContactsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Create contact
  on(ContactsActions.createContact, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ContactsActions.createContactSuccess, (state, { contact }) =>
    contactsAdapter.addOne(contact, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(ContactsActions.createContactFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Update contact
  on(ContactsActions.updateContact, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ContactsActions.updateContactSuccess, (state, { contact }) =>
    contactsAdapter.updateOne(
      { id: contact.$id, changes: contact },
      {
        ...state,
        loading: false,
        error: null
      }
    )
  ),
  on(ContactsActions.updateContactFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Delete contact
  on(ContactsActions.deleteContact, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ContactsActions.deleteContactSuccess, (state, { id }) =>
    contactsAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(ContactsActions.deleteContactFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Search
  on(ContactsActions.setContactsSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm
  }))
);
