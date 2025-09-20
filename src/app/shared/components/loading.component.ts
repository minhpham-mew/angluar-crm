import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <p-progressSpinner 
          styleClass="w-12 h-12"
          strokeWidth="4"
          animationDuration="1s">
        </p-progressSpinner>
        <p class="mt-4 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {}
