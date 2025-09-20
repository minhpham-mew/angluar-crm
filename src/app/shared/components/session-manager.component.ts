import { Component, inject, input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { SessionService } from '../../core/services/session.service';
import * as AuthActions from '../../auth/store/auth.actions';
import * as NotificationsActions from '../store/notifications/notifications.actions';

@Component({
  selector: 'app-session-manager',
  imports: [
    CommonModule,
    DialogModule,
    CardModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  templateUrl: './session-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class SessionManagerComponent implements OnInit {
  private sessionService = inject(SessionService);
  private store = inject(Store);
  private confirmationService = inject(ConfirmationService);

  visible = input<boolean>(false);
  
  currentSession: any = null;
  allSessions: any = null;

  get isVisible() {
    return this.visible();
  }

  ngOnInit() {
    this.loadSessions();
  }

  async loadSessions() {
    try {
      // Load current session info
      this.currentSession = await this.sessionService.getSessionInfo();
      
      // Load all sessions
      this.allSessions = await this.sessionService.getAllSessions();
      
      // Mark current session in the list
      if (this.allSessions?.sessions && this.currentSession) {
        this.allSessions.sessions = this.allSessions.sessions.map((session: any) => ({
          ...session,
          current: session.$id === this.currentSession.$id
        }));
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      this.store.dispatch(NotificationsActions.addNotification({
        notification: { message: 'Failed to load session information', type: 'error' }
      }));
    }
  }

  refreshSession() {
    this.store.dispatch(AuthActions.refreshSession());
    this.store.dispatch(NotificationsActions.addNotification({
      notification: { message: 'Session refreshed successfully', type: 'success' }
    }));
  }

  async deleteSession(sessionId: string) {
    try {
      await this.sessionService.deleteSession(sessionId);
      this.store.dispatch(NotificationsActions.addNotification({
        notification: { message: 'Session ended successfully', type: 'success' }
      }));
      // Reload sessions to update the list
      this.loadSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
      this.store.dispatch(NotificationsActions.addNotification({
        notification: { message: 'Failed to end session', type: 'error' }
      }));
    }
  }

  confirmEndAllSessions() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to end all other sessions? This will log you out from all other devices.',
      header: 'End All Other Sessions',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.endAllOtherSessions();
      }
    });
  }

  private async endAllOtherSessions() {
    try {
      // Get all sessions except current
      const otherSessions = this.allSessions?.sessions?.filter((session: any) => !session.current) || [];
      
      // Delete each session individually (except current)
      for (const session of otherSessions) {
        await this.sessionService.deleteSession(session.$id);
      }
      
      this.store.dispatch(NotificationsActions.addNotification({
        notification: { message: 'All other sessions ended successfully', type: 'success' }
      }));
      
      // Reload sessions
      this.loadSessions();
    } catch (error) {
      console.error('Failed to end all sessions:', error);
      this.store.dispatch(NotificationsActions.addNotification({
        notification: { message: 'Failed to end all sessions', type: 'error' }
      }));
    }
  }
}
