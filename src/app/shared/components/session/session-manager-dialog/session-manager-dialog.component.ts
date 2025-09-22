import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';

// Local Components
import { CurrentSessionInfoComponent } from '../current-session-info/current-session-info.component';
import { SessionsListComponent } from '../sessions-list/sessions-list.component';

@Component({
  selector: 'app-session-manager-dialog',
  imports: [CommonModule, DialogModule, CurrentSessionInfoComponent, SessionsListComponent],
  templateUrl: './session-manager-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionManagerDialogComponent {
  visible = input<boolean>(false);
  currentSession = input<any | null>(null);
  allSessions = input<any | null>(null);

  dialogHide = output<void>();
  refreshSession = output<void>();
  deleteSession = output<string>();
  deleteAllOtherSessions = output<void>();
}
