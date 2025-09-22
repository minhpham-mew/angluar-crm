import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
// PrimeNG Imports
import { CardModule } from 'primeng/card';

import { Contact, Meeting } from '../../../../core/models';

@Component({
  selector: 'app-recent-activity',
  imports: [CommonModule, RouterLink, CardModule, AvatarModule],
  templateUrl: './recent-activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityComponent {
  recentContacts = input<Contact[]>([]);
  upcomingMeetingsList = input<Meeting[]>([]);

  getContactInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
