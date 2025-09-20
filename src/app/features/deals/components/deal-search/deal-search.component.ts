import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-deal-search',
  imports: [CommonModule, InputTextModule],
  templateUrl: './deal-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DealSearchComponent {
  searchTerm = input<string>('');
  searchChange = output<string>();

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }
}
