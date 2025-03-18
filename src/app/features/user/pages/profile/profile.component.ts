import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core';
import {Router} from '@angular/router';
import {UserResponse, UserUpdateDTO} from '../../../../core/models/user.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../core/services/user.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user: UserResponse | null = null
  profileForm: FormGroup
  passwordForm: FormGroup
  activeTab: "profile" | "password" = "profile"

  isUpdating = false
  updateSuccess = false
  updateError = ""

  isUpdatingPassword = false
  passwordSuccess = false
  passwordError = ""

  avatarUploading = false
  avatarSuccess = false

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.profileForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
    })

    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile(): void {
    this.authService.getLoggedInUser().subscribe({
      next: (user: UserResponse) => {
        this.user = user
        this.profileForm.patchValue({
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
        })
      },
      error: (error) => {
        console.error("Error loading user profile", error)
      },
    })
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return
    }

    this.isUpdating = true
    this.updateSuccess = false
    this.updateError = ""

    const updateData: UserUpdateDTO = {
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      phone: this.profileForm.value.phone,
    }

    if (!this.user?.id) {
      this.updateError = "User ID not found"
      this.isUpdating = false
      return
    }

    this.userService.update(this.user.id, updateData).subscribe({
      next: (response) => {
        this.isUpdating = false
        this.updateSuccess = true
        this.user = response

        if (response.token) {
          this.authService.updateToken(response.token)
        }
      },
      error: (error) => {
        this.isUpdating = false
        this.updateError = error.error?.message || "Failed to update profile. Please try again."
      },
    })
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) {
      return
    }

    this.isUpdatingPassword = true
    this.passwordSuccess = false
    this.passwordError = ""

    const passwordData = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
    }

    if (!this.user?.id) {
      this.passwordError = "User ID not found"
      this.isUpdatingPassword = false
      return
    }

    this.userService.updatePassword(this.user.id, passwordData).subscribe({
      next: () => {
        this.isUpdatingPassword = false
        this.passwordSuccess = true
        this.passwordForm.reset()
      },
      error: (error) => {
        this.isUpdatingPassword = false
        if (error.error && error.error.errors) {
          this.passwordError = error.error.errors.newPassword || "An error occurred";
        } else {
          this.passwordError = "An error occurred";
        }
      },
    })
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]

      if (!file.type.match(/image\/*/) || file.size > 10 * 1024 * 1024) {
        alert("Please select a valid image file (max 10MB)")
        return
      }

      this.avatarUploading = true
      this.avatarSuccess = false

      if (!this.user?.id) {
        alert("User ID not found")
        this.avatarUploading = false
        return
      }

      this.userService.updateAvatar(this.user.id, file).subscribe({
        next: (response) => {
          this.avatarUploading = false
          this.avatarSuccess = true
          this.user = response

          input.value = ""

          setTimeout(() => {
            this.avatarSuccess = false
          }, 3000)
        },
        error: (error) => {
          this.avatarUploading = false
          alert(error.error?.message || "Failed to upload avatar. Please try again.")

          input.value = ""
        },
      })
    }
  }

  getInitials(): string {
    if (!this.user?.username) {
      return "U"
    }

    return this.user.username.charAt(0).toUpperCase()
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get("newPassword")?.value
    const confirmPassword = group.get("confirmPassword")?.value

    return newPassword === confirmPassword ? null : { passwordMismatch: true }
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/auth/login"])
  }
}
