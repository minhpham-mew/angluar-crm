import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
// InputTextareaModule - using regular textarea for now
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { 
  selectFilteredContacts, 
  selectContactsLoading, 
  selectContactsError,
  selectContactsSearchTerm 
} from '../store/contacts.selectors';
import { selectUserTenantId } from '../../../auth/store/auth.selectors';
import { Contact } from '../../../core/models';
import * as ContactsActions from '../store/contacts.actions';

@Component({
  selector: 'app-contacts',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    // InputTextareaModule - removed for now
    ProgressSpinnerModule,
    MessageModule,
    AvatarModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  templateUrl: './contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class ContactsComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);

  contacts$ = this.store.select(selectFilteredContacts);
  loading$ = this.store.select(selectContactsLoading);
  error$ = this.store.select(selectContactsError);
  searchTerm$ = this.store.select(selectContactsSearchTerm);
  tenantId$ = this.store.select(selectUserTenantId);

  displayContactDialog = false;
  selectedContact: Contact | null = null;

  contactForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    position: [''],
    notes: ['']
  });

  ngOnInit() {
    this.store.dispatch(ContactsActions.loadContacts());
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(ContactsActions.setContactsSearchTerm({ searchTerm: target.value }));
  }

  openAddContactDialog() {
    this.selectedContact = null;
    this.contactForm.reset();
    this.displayContactDialog = true;
  }

  editContact(contact: Contact) {
    this.selectedContact = contact;
    this.contactForm.patchValue({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      notes: contact.notes || ''
    });
    this.displayContactDialog = true;
  }

  saveContact() {
    if (this.contactForm.valid) {
      this.tenantId$.subscribe(tenantId => {
        if (tenantId) {
          const contactData = {
            ...this.contactForm.value,
            tenantId
          };

          if (this.selectedContact) {
            // Update existing contact
            this.store.dispatch(ContactsActions.updateContact({
              id: this.selectedContact.$id,
              changes: contactData
            }));
          } else {
            // Create new contact
            this.store.dispatch(ContactsActions.createContact({
              contact: contactData
            }));
          }
          
          this.hideContactDialog();
        }
      }).unsubscribe();
    }
  }

  deleteContact(contact: Contact) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(ContactsActions.deleteContact({ id: contact.$id }));
      }
    });
  }

  hideContactDialog() {
    this.displayContactDialog = false;
    this.selectedContact = null;
    this.contactForm.reset();
  }
}
