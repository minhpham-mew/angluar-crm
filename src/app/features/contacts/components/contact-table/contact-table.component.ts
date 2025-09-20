import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../../core/models';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-contact-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  templateUrl: './contact-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactTableComponent {
  contacts = input<Contact[]>([]);
  loading = input<boolean>(false);
  error = input<string | null>(null);

  addContact = output<void>();
  editContact = output<Contact>();
  deleteContact = output<Contact>();

  getContactInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
