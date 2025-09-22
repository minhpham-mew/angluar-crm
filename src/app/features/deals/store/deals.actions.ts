import { createAction, props } from '@ngrx/store';

import { Deal } from '../../../core/models';

// Load deals
export const loadDeals = createAction('[Deals] Load Deals');

export const loadDealsSuccess = createAction(
  '[Deals] Load Deals Success',
  props<{ deals: Deal[] }>(),
);

export const loadDealsFailure = createAction(
  '[Deals] Load Deals Failure',
  props<{ error: string }>(),
);

// Create deal
export const createDeal = createAction(
  '[Deals] Create Deal',
  props<{ deal: Omit<Deal, '$id' | '$createdAt' | '$updatedAt'> }>(),
);

export const createDealSuccess = createAction(
  '[Deals] Create Deal Success',
  props<{ deal: Deal }>(),
);

export const createDealFailure = createAction(
  '[Deals] Create Deal Failure',
  props<{ error: string }>(),
);

// Update deal
export const updateDeal = createAction(
  '[Deals] Update Deal',
  props<{ id: string; changes: Partial<Deal> }>(),
);

export const updateDealSuccess = createAction(
  '[Deals] Update Deal Success',
  props<{ deal: Deal }>(),
);

export const updateDealFailure = createAction(
  '[Deals] Update Deal Failure',
  props<{ error: string }>(),
);

// Delete deal
export const deleteDeal = createAction('[Deals] Delete Deal', props<{ id: string }>());

export const deleteDealSuccess = createAction(
  '[Deals] Delete Deal Success',
  props<{ id: string }>(),
);

export const deleteDealFailure = createAction(
  '[Deals] Delete Deal Failure',
  props<{ error: string }>(),
);

// Search
export const setDealsSearchTerm = createAction(
  '[Deals] Set Search Term',
  props<{ searchTerm: string }>(),
);
