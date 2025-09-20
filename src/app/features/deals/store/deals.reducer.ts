import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Deal } from '../../../core/models';
import * as DealsActions from './deals.actions';

export interface DealsEntityState extends EntityState<Deal> {
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const dealsAdapter: EntityAdapter<Deal> = createEntityAdapter<Deal>({
  selectId: (deal: Deal) => deal.$id,
});

export const initialState: DealsEntityState = dealsAdapter.getInitialState({
  loading: false,
  error: null,
  searchTerm: ''
});

export const dealsReducer = createReducer(
  initialState,
  // Load deals
  on(DealsActions.loadDeals, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DealsActions.loadDealsSuccess, (state, { deals }) =>
    dealsAdapter.setAll(deals, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(DealsActions.loadDealsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Create deal
  on(DealsActions.createDeal, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DealsActions.createDealSuccess, (state, { deal }) =>
    dealsAdapter.addOne(deal, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(DealsActions.createDealFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Update deal
  on(DealsActions.updateDeal, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DealsActions.updateDealSuccess, (state, { deal }) =>
    dealsAdapter.updateOne(
      { id: deal.$id, changes: deal },
      {
        ...state,
        loading: false,
        error: null
      }
    )
  ),
  on(DealsActions.updateDealFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Delete deal
  on(DealsActions.deleteDeal, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DealsActions.deleteDealSuccess, (state, { id }) =>
    dealsAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(DealsActions.deleteDealFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Search
  on(DealsActions.setDealsSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm
  }))
);
