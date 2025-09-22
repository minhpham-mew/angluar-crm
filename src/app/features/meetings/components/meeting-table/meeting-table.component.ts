import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { Meeting } from '../../../../core/models';

@Component({
  selector: 'app-meeting-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './meeting-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingTableComponent {
  meetings = input<Meeting[]>([]);
  loading = input<boolean>(false);
  error = input<string | null>(null);

  addMeeting = output<void>();
  editMeeting = output<Meeting>();
  deleteMeeting = output<Meeting>();

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
}
