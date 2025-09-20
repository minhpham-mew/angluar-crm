import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-current-session-info',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './current-session-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentSessionInfoComponent {
  currentSession = input<any | null>(null);
  refreshSession = output<void>();
}
