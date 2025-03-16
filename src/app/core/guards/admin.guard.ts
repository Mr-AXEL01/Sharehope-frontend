import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {UserProfileService} from '../services/user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private userProfileService: UserProfileService, private router: Router) {}

  canActivate(): boolean {
    if (this.userProfileService.isAdmin()) {
      return true;
    }
    this.router.navigate(['/profile']);
    return false;
  }
}
