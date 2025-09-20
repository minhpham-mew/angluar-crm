import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { 
  selectFilteredMeetings, 
  selectMeetingsLoading, 
  selectMeetingsError,
  selectMeetingsSearchTerm,
  selectTodaysMeetings
} from '../store/meetings.selectors';
import { selectUserTenantId } from '../../../auth/store/auth.selectors';
import { Meeting } from '../../../core/models';
import * as MeetingsActions from '../store/meetings.actions';

@Component({
  selector: 'app-meetings',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ProgressSpinnerModule,
    MessageModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  templateUrl: './meetings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class MeetingsComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);

  meetings$ = this.store.select(selectFilteredMeetings);
  loading$ = this.store.select(selectMeetingsLoading);
  error$ = this.store.select(selectMeetingsError);
  searchTerm$ = this.store.select(selectMeetingsSearchTerm);
  todaysMeetings$ = this.store.select(selectTodaysMeetings);
  tenantId$ = this.store.select(selectUserTenantId);

  displayMeetingDialog = false;
  selectedMeeting: Meeting | null = null;

  meetingForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    startDateTime: ['', [Validators.required]],
    endDateTime: ['', [Validators.required]],
    location: [''],
    contactId: [''],
    dealId: ['']
  });

  ngOnInit() {
    this.store.dispatch(MeetingsActions.loadMeetings());
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(MeetingsActions.setMeetingsSearchTerm({ searchTerm: target.value }));
  }

  openAddMeetingDialog() {
    this.selectedMeeting = null;
    this.meetingForm.reset({
      title: '',
      description: '',
      startDateTime: '',
      endDateTime: '',
      location: '',
      contactId: '',
      dealId: ''
    });
    this.displayMeetingDialog = true;
  }

  editMeeting(meeting: Meeting) {
    this.selectedMeeting = meeting;
    this.meetingForm.patchValue({
      title: meeting.title,
      description: meeting.description || '',
      startDateTime: this.formatDateTimeForInput(meeting.startDateTime),
      endDateTime: this.formatDateTimeForInput(meeting.endDateTime),
      location: meeting.location || '',
      contactId: meeting.contactId || '',
      dealId: meeting.dealId || ''
    });
    this.displayMeetingDialog = true;
  }

  saveMeeting() {
    if (this.meetingForm.valid) {
      this.tenantId$.subscribe(tenantId => {
        if (tenantId) {
          const formValue = this.meetingForm.value;
          const meetingData = {
            ...formValue,
            tenantId,
            startDateTime: new Date(formValue.startDateTime).toISOString(),
            endDateTime: new Date(formValue.endDateTime).toISOString()
          };

          if (this.selectedMeeting) {
            // Update existing meeting
            this.store.dispatch(MeetingsActions.updateMeeting({
              id: this.selectedMeeting.$id,
              changes: meetingData
            }));
          } else {
            // Create new meeting
            this.store.dispatch(MeetingsActions.createMeeting({
              meeting: meetingData
            }));
          }
          
          this.hideMeetingDialog();
        }
      }).unsubscribe();
    }
  }

  deleteMeeting(meeting: Meeting) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the meeting "${meeting.title}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(MeetingsActions.deleteMeeting({ id: meeting.$id }));
      }
    });
  }

  hideMeetingDialog() {
    this.displayMeetingDialog = false;
    this.selectedMeeting = null;
    this.meetingForm.reset();
  }

  getMeetingDuration(startDateTime: string, endDateTime: string): string {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes}m`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }

  private formatDateTimeForInput(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
