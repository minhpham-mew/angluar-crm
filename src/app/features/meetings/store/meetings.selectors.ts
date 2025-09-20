import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MeetingsEntityState, meetingsAdapter } from './meetings.reducer';

export const selectMeetingsState = createFeatureSelector<MeetingsEntityState>('meetings');

const { selectIds, selectEntities, selectAll, selectTotal } = meetingsAdapter.getSelectors();

export const selectMeetingIds = createSelector(selectMeetingsState, selectIds);
export const selectMeetingEntities = createSelector(selectMeetingsState, selectEntities);
export const selectAllMeetings = createSelector(selectMeetingsState, selectAll);
export const selectMeetingsTotal = createSelector(selectMeetingsState, selectTotal);

export const selectMeetingsLoading = createSelector(
  selectMeetingsState,
  (state) => state.loading
);

export const selectMeetingsError = createSelector(
  selectMeetingsState,
  (state) => state.error
);

export const selectMeetingsSearchTerm = createSelector(
  selectMeetingsState,
  (state) => state.searchTerm
);

export const selectFilteredMeetings = createSelector(
  selectAllMeetings,
  selectMeetingsSearchTerm,
  (meetings, searchTerm) => {
    if (!searchTerm) {
      return meetings;
    }
    const term = searchTerm.toLowerCase();
    return meetings.filter(meeting =>
      meeting.title.toLowerCase().includes(term) ||
      (meeting.description && meeting.description.toLowerCase().includes(term)) ||
      (meeting.location && meeting.location.toLowerCase().includes(term))
    );
  }
);

export const selectMeetingById = (id: string) => createSelector(
  selectMeetingEntities,
  (entities) => entities[id]
);

export const selectUpcomingMeetings = createSelector(
  selectAllMeetings,
  (meetings) => meetings
    .filter(meeting => new Date(meeting.startDateTime) > new Date())
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
    .slice(0, 5)
);

export const selectTodaysMeetings = createSelector(
  selectAllMeetings,
  (meetings) => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.startDateTime);
      return meetingDate >= todayStart && meetingDate < todayEnd;
    });
  }
);
