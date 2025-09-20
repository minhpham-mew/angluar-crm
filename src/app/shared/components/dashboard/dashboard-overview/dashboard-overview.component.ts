import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

// Local Components
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { StatsGridComponent } from '../stats-grid/stats-grid.component';
import { RecentActivityComponent } from '../recent-activity/recent-activity.component';

// Store
import { selectRecentContacts, selectContactsTotal } from '../../../../features/contacts/store/contacts.selectors';
import { selectDealsPipelineValue, selectAllDeals } from '../../../../features/deals/store/deals.selectors';
import { selectUpcomingMeetings } from '../../../../features/meetings/store/meetings.selectors';
import { selectUserTenantId } from '../../../../auth/store/auth.selectors';
import { filter, take } from 'rxjs/operators';
import * as ContactsActions from '../../../../features/contacts/store/contacts.actions';
import * as DealsActions from '../../../../features/deals/store/deals.actions';
import * as MeetingsActions from '../../../../features/meetings/store/meetings.actions';

@Component({
  selector: 'app-dashboard-overview',
  imports: [
    CommonModule,
    DashboardHeaderComponent,
    StatsGridComponent,
    RecentActivityComponent
  ],
  templateUrl: './dashboard-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
}
