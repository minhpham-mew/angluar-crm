import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { filter, take } from 'rxjs/operators';

import { selectUserTenantId } from '../../../../auth/store/auth.selectors';
// Models
import { Contact } from '../../../../core/models';
import * as NotificationsActions from '../../../../shared/store/notifications/notifications.actions';
import * as ContactsActions from '../../store/contacts.actions';
// Store
import {
  selectContactsError,
  selectContactsLoading,
  selectContactsSearchTerm,
  selectFilteredContacts,
} from '../../store/contacts.selectors';
import { ContactFormComponent } from '../contact-form/contact-form.component';
// Local Components
import { ContactSearchComponent } from '../contact-search/contact-search.component';
import { ContactTableComponent } from '../contact-table/contact-table.component';

@Component({
  selector: 'app-contacts-list',
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    ContactSearchComponent,
    ContactTableComponent,
    ContactFormComponent,
  ],
  templateUrl: './contacts-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ContactsListComponent implements OnInit {
  private store = inject(Store);
  private confirmationService = inject(ConfirmationService);

  // Observables
  contacts$ = this.store.select(selectFilteredContacts);
  loading$ = this.store.select(selectContactsLoading);
  error$ = this.store.select(selectContactsError);
  searchTerm$ = this.store.select(selectContactsSearchTerm);

  // Component state
  displayContactDialog = false;
  selectedContact = signal<Contact | null>(null);

  ngOnInit() {
    // Wait for tenant ID to be available before loading contacts
    this.store
      .select(selectUserTenantId)
      .pipe(
        filter((tenantId) => !!tenantId),
        take(1),
      )
      .subscribe(() => {
        this.store.dispatch(ContactsActions.loadContacts());
      });
  }

  onSearchChange(searchTerm: string) {
    this.store.dispatch(ContactsActions.setContactsSearchTerm({ searchTerm }));
  }

  openAddContactDialog() {
    this.selectedContact.set(null);
    this.displayContactDialog = true;
  }

  openEditContactDialog(contact: Contact) {
    this.selectedContact.set(contact);
    this.displayContactDialog = true;
  }

  closeContactDialog() {
    this.displayContactDialog = false;
    this.selectedContact.set(null);
  }

  saveContact(contactData: Partial<Contact>) {
    if (contactData.$id) {
      // Update existing contact
      this.store.dispatch(
        ContactsActions.updateContact({
          id: contactData.$id,
          changes: contactData,
        }),
      );
    } else {
      // Create new contact
      this.store.dispatch(
        ContactsActions.createContact({
          contact: contactData as Omit<Contact, '$id' | '$createdAt' | '$updatedAt'>,
        }),
      );
    }
  }

  confirmDeleteContact(contact: Contact) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`,
      header: 'Delete Contact',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(ContactsActions.deleteContact({ id: contact.$id }));
      },
    });
  }
}
