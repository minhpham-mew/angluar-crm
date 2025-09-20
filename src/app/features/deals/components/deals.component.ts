import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
// Note: DropdownModule and CalendarModule may not be available in this PrimeNG version
// Using styled HTML inputs as fallback

import { 
  selectFilteredDeals, 
  selectDealsLoading, 
  selectDealsError,
  selectDealsSearchTerm,
  selectDealsPipelineValue,
  selectAllDeals
} from '../store/deals.selectors';
import { selectUserTenantId } from '../../../auth/store/auth.selectors';
import { Deal } from '../../../core/models';
import * as DealsActions from '../store/deals.actions';

@Component({
  selector: 'app-deals',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ProgressSpinnerModule,
    MessageModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    InputNumberModule,
    // DropdownModule,
    // CalendarModule
  ],
  templateUrl: './deals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class DealsComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);

  deals$ = this.store.select(selectFilteredDeals);
  allDeals$ = this.store.select(selectAllDeals);
  loading$ = this.store.select(selectDealsLoading);
  error$ = this.store.select(selectDealsError);
  searchTerm$ = this.store.select(selectDealsSearchTerm);
  pipelineValue$ = this.store.select(selectDealsPipelineValue);
  tenantId$ = this.store.select(selectUserTenantId);

  displayDealDialog = false;
  selectedDeal: Deal | null = null;

  stageOptions = [
    { label: 'Lead', value: 'lead' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Proposal', value: 'proposal' },
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Closed Won', value: 'closed_won' },
    { label: 'Closed Lost', value: 'closed_lost' }
  ];

  dealForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    value: [0, [Validators.required, Validators.min(0)]],
    stage: ['lead', [Validators.required]],
    probability: [50, [Validators.min(0), Validators.max(100)]],
    expectedCloseDate: [''],
    contactId: ['']
  });

  ngOnInit() {
    this.store.dispatch(DealsActions.loadDeals());
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(DealsActions.setDealsSearchTerm({ searchTerm: target.value }));
  }

  openAddDealDialog() {
    this.selectedDeal = null;
    this.dealForm.reset({
      title: '',
      description: '',
      value: 0,
      stage: 'lead',
      probability: 50,
      expectedCloseDate: '',
      contactId: ''
    });
    this.displayDealDialog = true;
  }

  editDeal(deal: Deal) {
    this.selectedDeal = deal;
    this.dealForm.patchValue({
      title: deal.title,
      description: deal.description || '',
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate) : null,
      contactId: deal.contactId || ''
    });
    this.displayDealDialog = true;
  }

  saveDeal() {
    if (this.dealForm.valid) {
      this.tenantId$.subscribe(tenantId => {
        if (tenantId) {
          const formValue = this.dealForm.value;
          const dealData = {
            ...formValue,
            tenantId,
            expectedCloseDate: formValue.expectedCloseDate ? 
              formValue.expectedCloseDate.toISOString().split('T')[0] : null
          };

          if (this.selectedDeal) {
            // Update existing deal
            this.store.dispatch(DealsActions.updateDeal({
              id: this.selectedDeal.$id,
              changes: dealData
            }));
          } else {
            // Create new deal
            this.store.dispatch(DealsActions.createDeal({
              deal: dealData
            }));
          }
          
          this.hideDealDialog();
        }
      }).unsubscribe();
    }
  }

  deleteDeal(deal: Deal) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the deal "${deal.title}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(DealsActions.deleteDeal({ id: deal.$id }));
      }
    });
  }

  hideDealDialog() {
    this.displayDealDialog = false;
    this.selectedDeal = null;
    this.dealForm.reset();
  }

  getStageLabel(stage: string): string {
    const option = this.stageOptions.find(opt => opt.value === stage);
    return option ? option.label : stage;
  }

  getStageSeverity(stage: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (stage) {
      case 'closed_won': return 'success';
      case 'closed_lost': return 'danger';
      case 'negotiation': return 'warning';
      case 'proposal': return 'info';
      case 'qualified': return 'info';
      default: return 'secondary';
    }
  }

  getDealsCountByStage(stage: string): number {
    let count = 0;
    this.allDeals$.subscribe(deals => {
      count = deals.filter(deal => deal.stage === stage).length;
    }).unsubscribe();
    return count;
  }
}
