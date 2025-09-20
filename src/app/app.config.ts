import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { environment } from '../environments/environment';
import { sessionInterceptor } from './core/interceptors/session.interceptor';

import { routes } from './app.routes';
import { authReducer } from './auth/store/auth.reducer';
import { notificationsReducer } from './shared/store/notifications/notifications.reducer';
import { contactsReducer } from './features/contacts/store/contacts.reducer';
import { dealsReducer } from './features/deals/store/deals.reducer';
import { meetingsReducer } from './features/meetings/store/meetings.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { ContactsEffects } from './features/contacts/store/contacts.effects';
import { DealsEffects } from './features/deals/store/deals.effects';
import { MeetingsEffects } from './features/meetings/store/meetings.effects';

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
