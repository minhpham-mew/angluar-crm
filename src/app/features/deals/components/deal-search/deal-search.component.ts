import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-deal-search',
  imports: [CommonModule, InputTextModule, InputGroupModule, InputGroupAddonModule, ButtonModule],
  templateUrl: './deal-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealSearchComponent {
  searchTerm = input<string>('');
  searchChange = output<string>();

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  doSearch(event: Event) {
    // Optional: trigger search on button click if needed
    // For now, search happens on input change
  }
}
