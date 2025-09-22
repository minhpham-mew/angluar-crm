import { createFeatureSelector, createSelector } from '@ngrx/store';

import { dealsAdapter, DealsEntityState } from './deals.reducer';

export const selectDealsState = createFeatureSelector<DealsEntityState>('deals');

const { selectIds, selectEntities, selectAll, selectTotal } = dealsAdapter.getSelectors();

export const selectDealIds = createSelector(selectDealsState, selectIds);
export const selectDealEntities = createSelector(selectDealsState, selectEntities);
export const selectAllDeals = createSelector(selectDealsState, selectAll);
export const selectDealsTotal = createSelector(selectDealsState, selectTotal);

export const selectDealsLoading = createSelector(selectDealsState, (state) => state.loading);

export const selectDealsError = createSelector(selectDealsState, (state) => state.error);

export const selectDealsSearchTerm = createSelector(selectDealsState, (state) => state.searchTerm);

export const selectFilteredDeals = createSelector(
  selectAllDeals,
  selectDealsSearchTerm,
  (deals, searchTerm) => {
    if (!searchTerm) {
      return deals;
    }
    const term = searchTerm.toLowerCase();
    return deals.filter(
      (deal) =>
        deal.title.toLowerCase().includes(term) ||
        (deal.description && deal.description.toLowerCase().includes(term)) ||
        deal.stage.toLowerCase().includes(term),
    );
  },
);

export const selectDealById = (id: string) =>
  createSelector(selectDealEntities, (entities) => entities[id]);

export const selectDealsByStage = (stage: string) =>
  createSelector(selectAllDeals, (deals) => deals.filter((deal) => deal.stage === stage));

export const selectDealsPipelineValue = createSelector(selectAllDeals, (deals) =>
  deals
    .filter((deal) => deal.stage !== 'closed_lost')
    .reduce((total, deal) => total + deal.value, 0),
);

export const selectUpcomingDeals = createSelector(selectAllDeals, (deals) =>
  deals
    .filter((deal) => deal.expectedCloseDate && new Date(deal.expectedCloseDate) > new Date())
    .sort(
      (a, b) =>
        new Date(a.expectedCloseDate || '').getTime() -
        new Date(b.expectedCloseDate || '').getTime(),
    )
    .slice(0, 5),
);
