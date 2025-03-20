import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LayoutComponent} from './core/layout/pages/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  template: `
      <router-outlet />
  `,
  standalone: true,
})
export class AppComponent {
  title = 'SHAREHOPE-FRONTEND';
}
