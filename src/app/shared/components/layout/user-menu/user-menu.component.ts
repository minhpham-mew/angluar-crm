import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models';

// PrimeNG Imports
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule, AvatarModule, ButtonModule, TooltipModule],
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent {
  user = input<User | null>(null);
  logout = output<void>();
  showSessionManager = output<void>();

  getUserInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }
}
