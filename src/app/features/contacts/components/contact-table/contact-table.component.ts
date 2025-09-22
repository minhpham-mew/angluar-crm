import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { Contact } from '../../../../core/models';

@Component({
  selector: 'app-contact-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './contact-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
