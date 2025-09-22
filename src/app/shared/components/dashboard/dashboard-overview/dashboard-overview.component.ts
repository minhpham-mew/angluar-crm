import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { selectUserTenantId } from '../../../../auth/store/auth.selectors';
import * as ContactsActions from '../../../../features/contacts/store/contacts.actions';
// Store
import {
  selectContactsTotal,
  selectRecentContacts,
} from '../../../../features/contacts/store/contacts.selectors';
import * as DealsActions from '../../../../features/deals/store/deals.actions';
import {
  selectAllDeals,
  selectDealsPipelineValue,
} from '../../../../features/deals/store/deals.selectors';
import * as MeetingsActions from '../../../../features/meetings/store/meetings.actions';
import { selectUpcomingMeetings } from '../../../../features/meetings/store/meetings.selectors';
// Local Components
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { RecentActivityComponent } from '../recent-activity/recent-activity.component';
import { StatsGridComponent } from '../stats-grid/stats-grid.component';

@Component({
  selector: 'app-dashboard-overview',
  imports: [CommonModule, DashboardHeaderComponent, StatsGridComponent, RecentActivityComponent],
  templateUrl: './dashboard-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardOverviewComponent implements OnInit {
  private store = inject(Store);

  recentContacts$ = this.store.select(selectRecentContacts);
  totalContacts$ = this.store.select(selectContactsTotal);
  pipelineValue$ = this.store.select(selectDealsPipelineValue);
  allDeals$ = this.store.select(selectAllDeals);
  upcomingMeetings$ = this.store.select(selectUpcomingMeetings);

  ngOnInit() {
    // Wait for tenant ID to be available before loading data
    this.store
      .select(selectUserTenantId)
      .pipe(
        filter((tenantId) => !!tenantId),
        take(1),
      )
      .subscribe(() => {
        // Load all data for dashboard once tenant ID is available
        this.store.dispatch(ContactsActions.loadContacts());
        this.store.dispatch(DealsActions.loadDeals());
        this.store.dispatch(MeetingsActions.loadMeetings());
      });
  }
}
