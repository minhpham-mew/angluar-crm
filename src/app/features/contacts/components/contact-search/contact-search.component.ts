import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-contact-search',
  imports: [CommonModule, InputTextModule],
  templateUrl: './contact-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactSearchComponent {
  searchTerm = input<string>('');
  searchChange = output<string>();

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }
}
