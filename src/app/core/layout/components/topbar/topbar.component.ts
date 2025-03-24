import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [
    RouterLink
  ],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 z-10">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left section -->
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button
              (click)="onToggleSidebar()"
              class="md:hidden -ml-1 mr-2 flex items-center justify-center h-10 w-10 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              aria-label="Open sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <!-- Page title -->
            <h1 class="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
          <!-- Right section -->
          <div class="flex items-center">
            <!-- User menu -->
            <div class="relative">
              <button
                (click)="toggleUserMenu()"
                class="flex items-center text-sm focus:outline-none"
                aria-label="User menu"
              >
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-2">
                  {{ userInitials }}
                </div>
                <span class="hidden md:block font-medium text-gray-700">{{ userName }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="hidden md:block h-5 w-5 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <!-- User dropdown -->
              @if (showUserMenu) {
                <div
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  (clickOutside)="showUserMenu = false"
                >
                  <div class="py-1">
                    <a [routerLink]="['/profile']" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <div class="border-t border-gray-200 my-1"></div>
                    <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  standalone: true,
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>()

  showUserMenu = false
  userName = "Admin User"
  userInitials = "AU"

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    // Get user info from auth service
    this.authService.getLoggedInUser().subscribe({
      next: (user) => {
        if (user) {
          this.userName = user.username || "Admin User"
          this.userInitials = this.getInitials(this.userName)
        }
      },
      error: (error) => {
        console.error("Error fetching user data", error)
      },
    })
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit()
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/auth/login"])
  }
}
