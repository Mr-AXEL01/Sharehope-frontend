import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

interface NavItem {
  label: string
  route: string
  icon: string
  exact?: boolean
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <aside
      class="bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-screen sticky top-0 z-10 overflow-y-auto"
      [class.w-64]="isExpanded"
      [class.w-16]="!isExpanded"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div class="flex items-center">
          <div class="bg-blue-600 p-2 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          @if (isExpanded) {
            <span class="text-xl font-bold text-blue-600">ShareHope</span>
          }
        </div>
        <button
          (click)="onToggleSidebar()"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            @if (isExpanded) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            }
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-5 px-2">
        <div class="space-y-1">
          @for (item of navItems; track item.label) {
            <a
              [routerLink]="[item.route]"
              routerLinkActive="bg-blue-50 text-blue-600"
              [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              [class.justify-center]="!isExpanded"
              [class.text-gray-600]="!isActive(item.route)"
              [class.hover:bg-gray-50]="!isActive(item.route)"
              [class.hover:text-gray-900]="!isActive(item.route)"
            >
              <div class="mr-3" [class.mr-0]="!isExpanded">
                <span [innerHTML]="getIcon(item.icon)" class="flex-shrink-0 h-6 w-6"></span>
              </div>
              @if (isExpanded) {
                <span>{{ item.label }}</span>
              }
            </a>
          }
        </div>
      </nav>

      <!-- User Section -->
      <div class="absolute bottom-0 w-full border-t border-gray-200 p-4">
        <a
          [routerLink]="['/']"
          class="group flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md p-2 transition-colors"
          [class.justify-center]="!isExpanded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-gray-500" [class.mr-0]="!isExpanded" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          @if (isExpanded) {
            <span>Back to Site</span>
          }
        </a>
      </div>
    </aside>
  `,
  standalone: true,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @Input() isExpanded = true
  @Output() toggleSidebar = new EventEmitter<void>()

  navItems: NavItem[] = [
    {
      label: "Dashboard",
      route: "/dashboard",
      icon: "dashboard",
      exact: true,
    },
    {
      label: "Content",
      route: "/dashboard/articles",
      icon: "articles",
    },
    {
      label: "Users",
      route: "/dashboard/users",
      icon: "users",
    },
    {
      label: "Roles",
      route: "/dashboard/roles",
      icon: "roles",
    },
    {
      label: "Categories",
      route: "/dashboard/categories",
      icon: "categories",
    },
    {
      label: "Donations",
      route: "/dashboard/donations",
      icon: "donations",
    },
    {
      label: "Requests",
      route: "/dashboard/requests",
      icon: "requests",
    },
    // {
    //   label: "Statistics",
    //   route: "/dashboard/statistics",
    //   icon: "statistics",
    // },
  ]

  constructor(private authService: AuthService, private sanitizer: DomSanitizer) {}

  onToggleSidebar(): void {
    this.toggleSidebar.emit()
  }

  isActive(route: string): boolean {
    return window.location.pathname.startsWith(route)
  }

  getIcon(icon: string): SafeHtml {
    let svg = "";
    switch (icon) {
      case "dashboard":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
             </svg>`;
        break;
      case "articles":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
             </svg>`;
        break;
      case "users":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
             </svg>`;
        break;
      case "roles":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>`;
        break;
      case "categories":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
             </svg>`;
        break;
      case "donations":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>`;
        break;
      case "requests":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
             </svg>`;
        break;
      case "statistics":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
             </svg>`;
        break;
      default:
        svg = "";
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  ngOnInit(): void {
    // Initialize any dynamic data here
    this.authService.getRoles()
  }
}
