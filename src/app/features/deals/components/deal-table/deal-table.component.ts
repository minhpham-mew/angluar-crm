import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { Deal } from '../../../../core/models';

@Component({
  selector: 'app-deal-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './deal-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealTableComponent {
  deals = input<Deal[]>([]);
  loading = input<boolean>(false);
  error = input<string | null>(null);

  addDeal = output<void>();
  editDeal = output<Deal>();
  deleteDeal = output<Deal>();

  getStageLabel(stage: string): string {
    const stageLabels: Record<string, string> = {
      lead: 'Lead',
      qualified: 'Qualified',
      proposal: 'Proposal',
      negotiation: 'Negotiation',
      closed_won: 'Closed Won',
      closed_lost: 'Closed Lost',
    };
    return stageLabels[stage] || stage;
  }

  getStageSeverity(stage: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'secondary'> = {
      lead: 'info',
      qualified: 'info',
      proposal: 'warning',
      negotiation: 'warning',
      closed_won: 'success',
      closed_lost: 'danger',
    };
    return severityMap[stage] || 'secondary';
  }
}
