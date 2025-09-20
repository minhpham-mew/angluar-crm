import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models';

// Local Components
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, NavMenuComponent, UserMenuComponent],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  user = input<User | null>(null);
  logout = output<void>();
  showSessionManager = output<void>();
}
