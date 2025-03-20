import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core';
import {RouterLink} from '@angular/router';

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
      this.authService.loginAndRedirect(credentials, (err) => {
        this.isSubmitting = false;
        this.errorMessage = (err.error?.message) ? 'Username or password are incorrect' : 'Login failed. Please try again.';
      });
    }
  }
}
