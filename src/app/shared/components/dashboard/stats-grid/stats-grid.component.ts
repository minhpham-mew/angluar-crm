import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
// PrimeNG Imports
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-stats-grid',
  imports: [CommonModule, CardModule],
  templateUrl: './stats-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsGridComponent {
  totalContacts = input<number>(0);
  totalDeals = input<number>(0);
  upcomingMeetings = input<number>(0);
  pipelineValue = input<number>(0);
}
