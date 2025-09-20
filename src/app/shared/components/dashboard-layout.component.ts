import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

import { selectCurrentUser, selectUserTenantId } from '../../auth/store/auth.selectors';
import { SessionService } from '../../core/services/session.service';
import { SessionManagerComponent } from './session-manager.component';
import { filter, take } from 'rxjs/operators';
import * as AuthActions from '../../auth/store/auth.actions';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    SessionManagerComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent implements OnInit {
  private store = inject(Store);
  private sessionService = inject(SessionService);

  user$ = this.store.select(selectCurrentUser);
  sessionManagerVisible = false;

  ngOnInit() {
    // Wait for tenant ID to be available before any operations
    this.store.select(selectUserTenantId).pipe(
      filter(tenantId => !!tenantId),
      take(1)
    ).subscribe(() => {
      // Tenant ID is now available, dashboard can operate normally
      console.log('Dashboard layout initialized with tenant ID');
    });
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  showSessionManager() {
    this.sessionManagerVisible = true;
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
