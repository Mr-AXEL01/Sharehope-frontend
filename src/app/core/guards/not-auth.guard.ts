import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/profile']);
    return false;
  }
}
