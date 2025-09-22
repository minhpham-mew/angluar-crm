import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
// PrimeNG Imports
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { User } from '../../../../core/models';

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule, AvatarModule, ButtonModule, TooltipModule],
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  user = input<User | null>(null);
  logout = output<void>();
  showSessionManager = output<void>();

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
  }
}
