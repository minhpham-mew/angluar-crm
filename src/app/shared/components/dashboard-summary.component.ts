import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

import { selectRecentContacts, selectContactsTotal } from '../../features/contacts/store/contacts.selectors';
import { selectDealsPipelineValue, selectAllDeals } from '../../features/deals/store/deals.selectors';
import { selectUpcomingMeetings } from '../../features/meetings/store/meetings.selectors';
import { selectUserTenantId } from '../../auth/store/auth.selectors';
import { filter, take } from 'rxjs/operators';
import * as ContactsActions from '../../features/contacts/store/contacts.actions';
import * as DealsActions from '../../features/deals/store/deals.actions';
import * as MeetingsActions from '../../features/meetings/store/meetings.actions';

@Component({
  selector: 'app-dashboard-summary',
  imports: [
    CommonModule, 
    RouterLink,
    CardModule,
    ButtonModule,
    AvatarModule
  ],
  templateUrl: './dashboard-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardSummaryComponent implements OnInit {
  private store = inject(Store);

  recentContacts$ = this.store.select(selectRecentContacts);
  totalContacts$ = this.store.select(selectContactsTotal);
  pipelineValue$ = this.store.select(selectDealsPipelineValue);
  allDeals$ = this.store.select(selectAllDeals);
  upcomingMeetings$ = this.store.select(selectUpcomingMeetings);

  ngOnInit() {
    // Wait for tenant ID to be available before loading data
    this.store.select(selectUserTenantId).pipe(
      filter(tenantId => !!tenantId),
      take(1)
    ).subscribe(() => {
      // Load all data for dashboard once tenant ID is available
      this.store.dispatch(ContactsActions.loadContacts());
      this.store.dispatch(DealsActions.loadDeals());
      this.store.dispatch(MeetingsActions.loadMeetings());
    });
  }

  getContactInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
