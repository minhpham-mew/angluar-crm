import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavMenuComponent {}
