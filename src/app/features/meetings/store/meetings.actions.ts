import { createAction, props } from '@ngrx/store';
import { Meeting } from '../../../core/models';

// Load meetings
export const loadMeetings = createAction('[Meetings] Load Meetings');

export const loadMeetingsSuccess = createAction(
  '[Meetings] Load Meetings Success',
  props<{ meetings: Meeting[] }>()
);

export const loadMeetingsFailure = createAction(
  '[Meetings] Load Meetings Failure',
  props<{ error: string }>()
);

// Create meeting
export const createMeeting = createAction(
  '[Meetings] Create Meeting',
  props<{ meeting: Omit<Meeting, '$id' | '$createdAt' | '$updatedAt'> }>()
);

export const createMeetingSuccess = createAction(
  '[Meetings] Create Meeting Success',
  props<{ meeting: Meeting }>()
);

export const createMeetingFailure = createAction(
  '[Meetings] Create Meeting Failure',
  props<{ error: string }>()
);

// Update meeting
export const updateMeeting = createAction(
  '[Meetings] Update Meeting',
  props<{ id: string; changes: Partial<Meeting> }>()
);

export const updateMeetingSuccess = createAction(
  '[Meetings] Update Meeting Success',
  props<{ meeting: Meeting }>()
);

export const updateMeetingFailure = createAction(
  '[Meetings] Update Meeting Failure',
  props<{ error: string }>()
);

// Delete meeting
export const deleteMeeting = createAction(
  '[Meetings] Delete Meeting',
  props<{ id: string }>()
);

export const deleteMeetingSuccess = createAction(
  '[Meetings] Delete Meeting Success',
  props<{ id: string }>()
);

export const deleteMeetingFailure = createAction(
  '[Meetings] Delete Meeting Failure',
  props<{ error: string }>()
);

// Search
export const setMeetingsSearchTerm = createAction(
  '[Meetings] Set Search Term',
  props<{ searchTerm: string }>()
);
