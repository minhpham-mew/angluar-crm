import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import * as AuthActions from '../../../../auth/store/auth.actions';
// Store
import { selectCurrentUser, selectUserTenantId } from '../../../../auth/store/auth.selectors';
import { SessionService } from '../../../../core/services/session.service';
import * as NotificationsActions from '../../../store/notifications/notifications.actions';
import { SessionManagerDialogComponent } from '../../session/session-manager-dialog/session-manager-dialog.component';
// Local Components
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterOutlet, NavbarComponent, SessionManagerDialogComponent],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent implements OnInit {
  private store = inject(Store);
  private sessionService = inject(SessionService);

  user$ = this.store.select(selectCurrentUser);
  sessionManagerVisible = false;
  currentSession = signal<any | null>(null);
  allSessions = signal<any | null>(null);

  ngOnInit() {
    // Wait for tenant ID to be available before any operations
    this.store
      .select(selectUserTenantId)
      .pipe(
        filter((tenantId) => !!tenantId),
        take(1),
      )
      .subscribe(() => {
        // Tenant ID is now available, dashboard can operate normally
        console.log('Dashboard layout initialized with tenant ID');
      });
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  showSessionManager() {
    this.sessionManagerVisible = true;
    this.loadSessions();
  }

  hideSessionManager() {
    this.sessionManagerVisible = false;
  }

  async loadSessions() {
    try {
      // Load current session info
      this.currentSession.set(await this.sessionService.getSessionInfo());

      // Load all sessions
      this.allSessions.set(await this.sessionService.getAllSessions());

      // Mark current session in the list
      const allSessionsData = this.allSessions();
      const currentSessionData = this.currentSession();

      if (allSessionsData?.sessions && currentSessionData) {
        allSessionsData.sessions = allSessionsData.sessions.map((session: any) => ({
          ...session,
          current: session.$id === currentSessionData.$id,
        }));
        this.allSessions.set(allSessionsData);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      this.store.dispatch(
        NotificationsActions.addNotification({
          notification: { message: 'Failed to load session information', type: 'error' },
        }),
      );
    }
  }

  refreshSession() {
    this.store.dispatch(AuthActions.refreshSession());
    this.store.dispatch(
      NotificationsActions.addNotification({
        notification: { message: 'Session refreshed successfully', type: 'success' },
      }),
    );
  }

  async deleteSession(sessionId: string) {
    try {
      await this.sessionService.deleteSession(sessionId);
      this.store.dispatch(
        NotificationsActions.addNotification({
          notification: { message: 'Session ended successfully', type: 'success' },
        }),
      );
      // Reload sessions to update the list
      this.loadSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
      this.store.dispatch(
        NotificationsActions.addNotification({
          notification: { message: 'Failed to end session', type: 'error' },
        }),
      );
    }
  }

  async deleteAllOtherSessions() {
    try {
      await this.sessionService.deleteAllSessions();
      this.store.dispatch(
        NotificationsActions.addNotification({
          notification: { message: 'All other sessions ended successfully', type: 'success' },
        }),
      );
      // Reload sessions to update the list
      this.loadSessions();
    } catch (error) {
      console.error('Failed to delete all other sessions:', error);
      this.store.dispatch(
        NotificationsActions.addNotification({
          notification: { message: 'Failed to end other sessions', type: 'error' },
        }),
      );
    }
  }
}
