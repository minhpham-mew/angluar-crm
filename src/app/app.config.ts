import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { AuthEffects } from './auth/store/auth.effects';
import { authReducer } from './auth/store/auth.reducer';
import { sessionInterceptor } from './core/interceptors/session.interceptor';
import { ContactsEffects } from './features/contacts/store/contacts.effects';
import { contactsReducer } from './features/contacts/store/contacts.reducer';
import { DealsEffects } from './features/deals/store/deals.effects';
import { dealsReducer } from './features/deals/store/deals.reducer';
import { MeetingsEffects } from './features/meetings/store/meetings.effects';
import { meetingsReducer } from './features/meetings/store/meetings.reducer';
import { notificationsReducer } from './shared/store/notifications/notifications.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([sessionInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
    provideStore({
      auth: authReducer,
      notifications: notificationsReducer,
      contacts: contactsReducer,
      deals: dealsReducer,
      meetings: meetingsReducer,
    }),
    provideEffects([AuthEffects, ContactsEffects, DealsEffects, MeetingsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
};
