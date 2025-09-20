import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/components/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/components/signup.component').then((c) => c.SignupComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./shared/components/dashboard-layout.component').then(
        (c) => c.DashboardLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./shared/components/dashboard-summary.component').then(
            (c) => c.DashboardSummaryComponent
          ),
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./features/contacts/components/contacts.component').then(
            (c) => c.ContactsComponent
          ),
      },
      {
        path: 'deals',
        loadComponent: () =>
          import('./features/deals/components/deals.component').then((c) => c.DealsComponent),
      },
      {
        path: 'meetings',
        loadComponent: () =>
          import('./features/meetings/components/meetings.component').then(
            (c) => c.MeetingsComponent
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
