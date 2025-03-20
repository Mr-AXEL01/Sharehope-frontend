import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from '../../components/footer/footer.component';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [
    NavbarComponent,
    RouterOutlet,
    FooterComponent
  ],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-navbar></app-navbar>

      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  standalone: true,
})
export class LayoutComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getRoles()
    }
  }
}
