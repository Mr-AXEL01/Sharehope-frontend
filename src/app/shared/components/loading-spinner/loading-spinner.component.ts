import { Component, Input } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  imports: [
    NgClass
  ],
  template: `
    <div class="flex flex-col items-center justify-center" [ngClass]="{'fixed inset-0 bg-white/70 z-[9999]': overlay}">
      <div class="flex justify-center" [ngClass]="size">
        <div class="inline-block rounded-full border-[0.25em] border-current border-r-transparent text-blue-500 animate-spin"
             [ngClass]="{
           'w-8 h-8': !size,
           'w-4 h-4 border-[0.2em]': size === 'small',
           'w-12 h-12 border-[0.3em]': size === 'large'
         }"
             role="status">
          <span class="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">Loading...</span>
        </div>
      </div>
      @if (message) {
        <p class="mt-2 text-gray-600 text-sm">{{ message }}</p>
      }
    </div>
  `,
  standalone: true,
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  @Input() size: "small" | "medium" | "large" = "medium"
  @Input() overlay = false
  @Input() message?: string
}
