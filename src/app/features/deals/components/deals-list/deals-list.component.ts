import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { filter, take } from 'rxjs/operators';

import { selectUserTenantId } from '../../../../auth/store/auth.selectors';
// Models
import { Deal } from '../../../../core/models';
import * as NotificationsActions from '../../../../shared/store/notifications/notifications.actions';
import * as DealsActions from '../../store/deals.actions';
// Store
import {
  selectDealsError,
  selectDealsLoading,
  selectDealsPipelineValue,
  selectDealsSearchTerm,
  selectFilteredDeals,
} from '../../store/deals.selectors';
import { DealFormComponent } from '../deal-form/deal-form.component';
// Local Components
import { DealSearchComponent } from '../deal-search/deal-search.component';
import { DealTableComponent } from '../deal-table/deal-table.component';

@Component({
  selector: 'app-deals-list',
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    DealSearchComponent,
    DealTableComponent,
    DealFormComponent,
  ],
  templateUrl: './deals-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class DealsListComponent implements OnInit {
  private store = inject(Store);
  private confirmationService = inject(ConfirmationService);

  // Observables
  deals$ = this.store.select(selectFilteredDeals);
  loading$ = this.store.select(selectDealsLoading);
  error$ = this.store.select(selectDealsError);
  searchTerm$ = this.store.select(selectDealsSearchTerm);
  pipelineValue$ = this.store.select(selectDealsPipelineValue);

  // Component state
  displayDealDialog = false;
  selectedDeal = signal<Deal | null>(null);

  ngOnInit() {
    // Wait for tenant ID to be available before loading deals
    this.store
      .select(selectUserTenantId)
      .pipe(
        filter((tenantId) => !!tenantId),
        take(1),
      )
      .subscribe(() => {
        this.store.dispatch(DealsActions.loadDeals());
      });
  }

  onSearchChange(searchTerm: string) {
    this.store.dispatch(DealsActions.setDealsSearchTerm({ searchTerm }));
  }

  openAddDealDialog() {
    this.selectedDeal.set(null);
    this.displayDealDialog = true;
  }

  openEditDealDialog(deal: Deal) {
    this.selectedDeal.set(deal);
    this.displayDealDialog = true;
  }

  closeDealDialog() {
    this.displayDealDialog = false;
    this.selectedDeal.set(null);
  }

  saveDeal(dealData: Partial<Deal>) {
    if (dealData.$id) {
      // Update existing deal
      this.store.dispatch(
        DealsActions.updateDeal({
          id: dealData.$id,
          changes: dealData,
        }),
      );
    } else {
      // Create new deal
      this.store.dispatch(
        DealsActions.createDeal({
          deal: dealData as Omit<Deal, '$id' | '$createdAt' | '$updatedAt'>,
        }),
      );
    }
  }

  confirmDeleteDeal(deal: Deal) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the deal "${deal.title}"?`,
      header: 'Delete Deal',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(DealsActions.deleteDeal({ id: deal.$id }));
      },
    });
  }
}
