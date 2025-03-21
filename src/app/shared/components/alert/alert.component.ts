import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

export type AlertType = "success" | "info" | "warning" | "error"

@Component({
  selector: 'app-alert',
  imports: [
    NgClass
  ],
  standalone: true,
  template: `@if (show) {
    <div class="alert-container" [ngClass]="'alert-' + type" role="alert">
      <div class="alert-icon">
        @if (type === 'success') {
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        } @else if (type === 'info') {
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        } @else if (type === 'warning') {
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        } @else if (type === 'error') {
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        }
      </div>
      <div class="alert-content">
        @if (title) {
          <div class="alert-title">{{ title }}</div>
        }
        <div class="alert-message">{{ message }}</div>
      </div>
      @if (dismissible) {
        <button
          type="button"
          class="alert-close"
          (click)="onDismiss()"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      }
    </div>
  }
  `,
  styles: [
    `
    .alert-container {
      display: flex;
      padding: 1rem;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
    }

    .alert-success {
      background-color: #d1fae5;
      border: 1px solid #a7f3d0;
      color: #065f46;
    }

    .alert-info {
      background-color: #dbeafe;
      border: 1px solid #bfdbfe;
      color: #1e40af;
    }

    .alert-warning {
      background-color: #fef3c7;
      border: 1px solid #fde68a;
      color: #92400e;
    }

    .alert-error {
      background-color: #fee2e2;
      border: 1px solid #fecaca;
      color: #b91c1c;
    }

    .alert-icon {
      flex-shrink: 0;
      margin-right: 0.75rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .alert-content {
      flex-grow: 1;
    }

    .alert-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .alert-message {
      font-size: 0.875rem;
    }

    .alert-close {
      flex-shrink: 0;
      margin-left: 0.75rem;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      color: currentColor;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .alert-close:hover {
      opacity: 1;
    }
  `,
  ],
})
export class AlertComponent {
  @Input() type: AlertType = "info"
  @Input() title?: string
  @Input() message = ""
  @Input() dismissible = true
  @Input() show = true
  @Input() autoClose = false
  @Input() autoCloseDelay = 5000

  @Output() dismissed = new EventEmitter<void>()

  private autoCloseTimeout?: any

  ngOnInit() {
    if (this.autoClose && this.show) {
      this.setAutoClose()
    }
  }

  ngOnChanges() {
    if (this.autoClose && this.show) {
      this.clearAutoClose()
      this.setAutoClose()
    }
  }

  ngOnDestroy() {
    this.clearAutoClose()
  }

  onDismiss() {
    this.show = false
    this.dismissed.emit()
    this.clearAutoClose()
  }

  private setAutoClose() {
    this.autoCloseTimeout = setTimeout(() => {
      this.onDismiss()
    }, this.autoCloseDelay)
  }

  private clearAutoClose() {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout)
    }
  }
}
