import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Contact, Meeting } from '../../../../core/models';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-recent-activity',
  imports: [CommonModule, RouterLink, CardModule, AvatarModule],
  templateUrl: './recent-activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentActivityComponent {
  recentContacts = input<Contact[]>([]);
  upcomingMeetingsList = input<Meeting[]>([]);

  getContactInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
