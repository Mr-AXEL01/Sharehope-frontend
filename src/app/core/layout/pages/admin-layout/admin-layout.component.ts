import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {Router, RouterOutlet} from '@angular/router';
import {TopbarComponent} from '../../components/topbar/topbar.component';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [
    SidebarComponent,
    RouterOutlet,
    TopbarComponent
  ],
  template: `
    <div class="min-h-[100vh] flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <app-sidebar [isExpanded]="sidebarExpanded" (toggleSidebar)="toggleSidebar()"></app-sidebar>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Topbar -->
        <app-topbar (toggleSidebar)="toggleSidebar()"></app-topbar>

        <!-- Content Area -->
        <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          @if (isLoading) {
            <div class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          } @else if (hasAccess) {
            <router-outlet></router-outlet>
          } @else {
            <div class="flex flex-col items-center justify-center h-full">
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Access Denied!</strong>
                <span class="block sm:inline"> You don't have permission to access this area.</span>
              </div>
              <button
                (click)="goToHome()"
                class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Return to Home
              </button>
            </div>
          }
        </main>
      </div>
    </div>
  `,
  standalone: true,
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  sidebarExpanded = true
  isLoading = true
  hasAccess = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Check if the user has access
    this.checkAccess()
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded
  }

  checkAccess(): void {
    this.isLoading = true

    // Make sure roles are loaded
    this.authService.getRoles()

    // Check if user is admin
    if (this.authService.isLoggedIn()) {
      if (this.authService.isAdmin()) {
        this.hasAccess = true
      } else {
        this.hasAccess = false
      }
      this.isLoading = false
    } else {
      // If not logged in, redirect to login
      this.isLoading = false
      this.hasAccess = false
      this.router.navigate(["/auth/login"])
    }
  }

  goToHome(): void {
    this.router.navigate(["/"])
  }
}

