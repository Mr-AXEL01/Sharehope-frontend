import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {AuthService} from './auth.service';
import {CustomJwtPayload} from '../models/jwt.module';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private token: string | null = null;
  private roles: string[] = [];

  constructor(private authService: AuthService) {
    this.token = this.authService.getToken();
    if (this.token) {
      console.log(this.roles)
      this.updateRoles();
    }
  }

  updateRoles() {
    this.token = this.authService.getToken();
    if (this.token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(this.token);
      this.roles = Array.isArray(decodedToken.roles)
        ? decodedToken.roles.map(role => (typeof role === 'string' ? role : role.role))
        : [];
    } else {
      this.roles = [];
    }
  }

  hasRole(requiredRole: string): boolean {
    return this.roles.includes(requiredRole);
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isUser(): boolean {
    return this.hasRole('ROLE_USER');
  }
}
