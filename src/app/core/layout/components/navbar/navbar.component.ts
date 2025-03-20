import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false
  isAdmin = false
  isMobileMenuOpen = false
  isUserMenuOpen = false
  userName = ""
  userAvatar: string | null = null
  userInitials = ""

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.updateUserState()
  }

  updateUserState(): void {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.isAdmin = this.authService.isAdmin()

    if (this.isLoggedIn) {
      this.authService.getLoggedInUser().subscribe({
        next: (user) => {
          this.userName = user.username || "User"
          this.userAvatar = user.avatar
          this.userInitials = this.getInitials(this.userName)
        },
        error: (error) => {
          console.error("Error fetching user data", error)
        },
      })
    }
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase()
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
    if (this.isMobileMenuOpen) {
      this.isUserMenuOpen = false
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen
  }

  logout(): void {
    this.authService.logout()
    this.isLoggedIn = false
    this.isAdmin = false
    this.isUserMenuOpen = false
    // Redirect to home or login page
    window.location.href = "/"
  }
}
