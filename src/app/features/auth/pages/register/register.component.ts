import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup
  isSubmitting = false
  errorMessage: string | null = null
  avatarPreview: string | null = null

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      phone: ["", [Validators.required]],
      avatar: [null],
      terms: [false, Validators.requiredTrue],
    })
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      const file = input.files[0]
      this.registerForm.patchValue({ avatar: file })

      const reader = new FileReader()
      reader.onload = () => {
        this.avatarPreview = reader.result as string

        const previewElement = document.querySelector(".avatar-preview")
        if (previewElement) {
          previewElement.innerHTML = `<img src="${this.avatarPreview}" alt="Avatar preview" class="w-16 h-16 rounded-full">`
        }
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true
      this.errorMessage = null
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isSubmitting = false
          this.router.navigate(["/auth/login"])
        },
        error: (err) => {
          this.isSubmitting = false
          this.errorMessage = err.error?.message || "Registration failed. Please try again."
        },
      })
    }
  }
}
