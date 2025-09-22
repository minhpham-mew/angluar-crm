import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { filter, take } from 'rxjs/operators';

import { selectUserTenantId } from '../../../../auth/store/auth.selectors';
// Models
import { Meeting } from '../../../../core/models';
import * as MeetingsActions from '../../store/meetings.actions';
// Store
import {
  selectFilteredMeetings,
  selectMeetingsError,
  selectMeetingsLoading,
  selectMeetingsSearchTerm,
} from '../../store/meetings.selectors';
import { MeetingFormComponent } from '../meeting-form/meeting-form.component';
// Local Components
import { MeetingSearchComponent } from '../meeting-search/meeting-search.component';
import { MeetingTableComponent } from '../meeting-table/meeting-table.component';

@Component({
  selector: 'app-meetings-list',
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    MeetingSearchComponent,
    MeetingTableComponent,
    MeetingFormComponent,
  ],
  templateUrl: './meetings-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class MeetingsListComponent implements OnInit {
  private store = inject(Store);
  private confirmationService = inject(ConfirmationService);

  // Observables
  meetings$ = this.store.select(selectFilteredMeetings);
  loading$ = this.store.select(selectMeetingsLoading);
  error$ = this.store.select(selectMeetingsError);
  searchTerm$ = this.store.select(selectMeetingsSearchTerm);

  // Component state
  displayMeetingDialog = false;
  selectedMeeting = signal<Meeting | null>(null);

  ngOnInit() {
    // Wait for tenant ID to be available before loading meetings
    this.store
      .select(selectUserTenantId)
      .pipe(
        filter((tenantId) => !!tenantId),
        take(1),
      )
      .subscribe(() => {
        this.store.dispatch(MeetingsActions.loadMeetings());
      });
  }

  onSearchChange(searchTerm: string) {
    this.store.dispatch(MeetingsActions.setMeetingsSearchTerm({ searchTerm }));
  }

  openAddMeetingDialog() {
    this.selectedMeeting.set(null);
    this.displayMeetingDialog = true;
  }

  openEditMeetingDialog(meeting: Meeting) {
    this.selectedMeeting.set(meeting);
    this.displayMeetingDialog = true;
  }

  closeMeetingDialog() {
    this.displayMeetingDialog = false;
    this.selectedMeeting.set(null);
  }

  saveMeeting(meetingData: Partial<Meeting>) {
    if (meetingData.$id) {
      // Update existing meeting
      this.store.dispatch(
        MeetingsActions.updateMeeting({
          id: meetingData.$id,
          changes: meetingData,
        }),
      );
    } else {
      // Create new meeting
      this.store.dispatch(
        MeetingsActions.createMeeting({
          meeting: meetingData as Omit<Meeting, '$id' | '$createdAt' | '$updatedAt'>,
        }),
      );
    }
  }

  confirmDeleteMeeting(meeting: Meeting) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the meeting "${meeting.title}"?`,
      header: 'Delete Meeting',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(MeetingsActions.deleteMeeting({ id: meeting.$id }));
      },
    });
  }
}
