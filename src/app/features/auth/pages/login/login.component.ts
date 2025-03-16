import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core';
import {Router, RouterLink} from '@angular/router';
import {UserProfileService} from '../../../../core/services/user-profile.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userProfileService: UserProfileService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.userProfileService.updateRoles();
          if (this.userProfileService.isAdmin()) {
            this.router.navigate(['/dashboard']);
          } else if (this.userProfileService.isUser()) {
            this.router.navigate(['/profile']);
          } else {
            this.router.navigate(['/auth/login']);
          }
        },
        error: err => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        },
      });
    }
  }
}
