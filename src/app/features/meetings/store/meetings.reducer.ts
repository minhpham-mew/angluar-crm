import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Meeting } from '../../../core/models';
import * as MeetingsActions from './meetings.actions';

export interface MeetingsEntityState extends EntityState<Meeting> {
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const meetingsAdapter: EntityAdapter<Meeting> = createEntityAdapter<Meeting>({
  selectId: (meeting: Meeting) => meeting.$id,
});

export const initialState: MeetingsEntityState = meetingsAdapter.getInitialState({
  loading: false,
  error: null,
  searchTerm: '',
});

export const meetingsReducer = createReducer(
  initialState,
  // Load meetings
  on(MeetingsActions.loadMeetings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.loadMeetingsSuccess, (state, { meetings }) =>
    meetingsAdapter.setAll(meetings, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(MeetingsActions.loadMeetingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Create meeting
  on(MeetingsActions.createMeeting, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.createMeetingSuccess, (state, { meeting }) =>
    meetingsAdapter.addOne(meeting, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(MeetingsActions.createMeetingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Update meeting
  on(MeetingsActions.updateMeeting, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.updateMeetingSuccess, (state, { meeting }) =>
    meetingsAdapter.updateOne(
      { id: meeting.$id, changes: meeting },
      {
        ...state,
        loading: false,
        error: null,
      },
    ),
  ),
  on(MeetingsActions.updateMeetingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Delete meeting
  on(MeetingsActions.deleteMeeting, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.deleteMeetingSuccess, (state, { id }) =>
    meetingsAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(MeetingsActions.deleteMeetingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Search
  on(MeetingsActions.setMeetingsSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
);
