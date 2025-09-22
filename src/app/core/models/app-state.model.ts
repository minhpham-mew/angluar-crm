import { ContactsState } from './contact.model';
import { DealsState } from './deal.model';
import { MeetingsState } from './meeting.model';
import { NotificationsState } from './notification.model';
import { AuthState } from './user.model';

export interface AppState {
  auth: AuthState;
  contacts: ContactsState;
  deals: DealsState;
  meetings: MeetingsState;
  notifications: NotificationsState;
}
