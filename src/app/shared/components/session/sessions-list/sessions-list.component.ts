import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-sessions-list',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, TooltipModule],
  templateUrl: './sessions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsListComponent {
  allSessions = input<any | null>(null);
  deleteSession = output<string>();
  deleteAllOtherSessions = output<void>();
}
