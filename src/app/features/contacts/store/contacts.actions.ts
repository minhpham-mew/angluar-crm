import { createAction, props } from '@ngrx/store';
import { Contact } from '../../../core/models';

// Load contacts
export const loadContacts = createAction('[Contacts] Load Contacts');

export const loadContactsSuccess = createAction(
  '[Contacts] Load Contacts Success',
  props<{ contacts: Contact[] }>()
);

export const loadContactsFailure = createAction(
  '[Contacts] Load Contacts Failure',
  props<{ error: string }>()
);

// Create contact
export const createContact = createAction(
  '[Contacts] Create Contact',
  props<{ contact: Omit<Contact, '$id' | '$createdAt' | '$updatedAt'> }>()
);

export const createContactSuccess = createAction(
  '[Contacts] Create Contact Success',
  props<{ contact: Contact }>()
);

export const createContactFailure = createAction(
  '[Contacts] Create Contact Failure',
  props<{ error: string }>()
);

// Update contact
export const updateContact = createAction(
  '[Contacts] Update Contact',
  props<{ id: string; changes: Partial<Contact> }>()
);

export const updateContactSuccess = createAction(
  '[Contacts] Update Contact Success',
  props<{ contact: Contact }>()
);

export const updateContactFailure = createAction(
  '[Contacts] Update Contact Failure',
  props<{ error: string }>()
);

// Delete contact
export const deleteContact = createAction(
  '[Contacts] Delete Contact',
  props<{ id: string }>()
);

export const deleteContactSuccess = createAction(
  '[Contacts] Delete Contact Success',
  props<{ id: string }>()
);

export const deleteContactFailure = createAction(
  '[Contacts] Delete Contact Failure',
  props<{ error: string }>()
);

// Search
export const setContactsSearchTerm = createAction(
  '[Contacts] Set Search Term',
  props<{ searchTerm: string }>()
);
