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
      import('./shared/components/layout/dashboard-layout/dashboard-layout.component').then(
        (c) => c.DashboardLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./shared/components/dashboard/dashboard-overview/dashboard-overview.component').then(
            (c) => c.DashboardOverviewComponent
          ),
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./features/contacts/components/contacts-list/contacts-list.component').then(
            (c) => c.ContactsListComponent
          ),
      },
      {
        path: 'deals',
        loadComponent: () =>
          import('./features/deals/components/deals-list/deals-list.component').then((c) => c.DealsListComponent),
      },
      {
        path: 'meetings',
        loadComponent: () =>
          import('./features/meetings/components/meetings-list/meetings-list.component').then(
            (c) => c.MeetingsListComponent
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
