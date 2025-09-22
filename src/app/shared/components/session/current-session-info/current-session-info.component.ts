import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
// PrimeNG Imports
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-current-session-info',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './current-session-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentSessionInfoComponent {
  currentSession = input<any | null>(null);
  refreshSession = output<void>();
}
