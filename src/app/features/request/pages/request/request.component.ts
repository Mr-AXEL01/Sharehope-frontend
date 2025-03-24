import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryResponseDTO} from '../../../../core/models/category.model';
import {CategoryService} from '../../../../core/services/category.service';
import {NeedService} from '../../../../core/services/need.service';
import {Router, RouterLink} from '@angular/router';
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';
import {AlertComponent} from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-request',
  imports: [
    LoadingSpinnerComponent,
    AlertComponent,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './request.component.html',
  standalone: true,
  styleUrl: './request.component.css'
})
export class RequestComponent implements OnInit {
  requestForm: FormGroup
  categories: CategoryResponseDTO[] = []
  isLoading = false
  isSubmitting = false
  errorMessage: string | null = null
  successMessage: string | null = null
  selectedFiles: File[] = []
  previewUrls: string[] = []
  requestSuccess = false

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private needService: NeedService,
    private router: Router,
  ) {
    this.requestForm = this.fb.group({
      categoryId: ["", Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      attachments: [null],
    })
  }

  ngOnInit(): void {
    this.loadCategories()
  }

  loadCategories(): void {
    this.isLoading = true
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories
        this.isLoading = false
        if (this.categories.length > 0) {
          this.requestForm.patchValue({ categoryId: this.categories[0].id })
        }
      },
      error: (error) => {
        console.error("Error loading categories", error)
        this.errorMessage = "Failed to load request categories. Please try again later."
        this.isLoading = false
      },
    })
  }

  onCategoryChange(): void {
    const categoryId = this.requestForm.get("categoryId")?.value;
    const selectedCategory = this.categories.find(c => c.id === Number(categoryId));
    const isFinancial = selectedCategory?.categoryName === "Financial";

    if (isFinancial) {
      // Make "amount" required and at least 1
      this.requestForm.get("amount")?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      // Clear validators and set amount to 0 for non-financial requests
      this.requestForm.get("amount")?.clearValidators();
      this.requestForm.get("amount")?.setValue(0);
    }
    this.requestForm.get("amount")?.updateValueAndValidity();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files) {
      // Clear previous selections
      this.selectedFiles = []
      this.previewUrls = []

      // Add new files
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i]
        this.selectedFiles.push(file)

        // Create preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = () => {
            this.previewUrls.push(reader.result as string)
          }
          reader.readAsDataURL(file)
        } else {
          // For non-image files, use a generic icon
          this.previewUrls.push("/placeholder.svg")
        }
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1)
    this.previewUrls.splice(index, 1)
  }

  submitRequest(): void {
    if (this.requestForm.invalid || this.isSubmitting) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.requestForm.controls).forEach((key) => {
        this.requestForm.get(key)?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true
    this.errorMessage = null
    this.successMessage = null

    // Create FormData for the request
    const formData = new FormData()
    formData.append("categoryId", this.requestForm.value.categoryId.toString())
    formData.append("amount", this.requestForm.value.amount.toString())
    formData.append("description", this.requestForm.value.description)

    // Append files if any
    this.selectedFiles.forEach((file) => {
      formData.append("attachments", file)
    })

    // Submit request
    this.needService.createNeed(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false
        this.successMessage = "Your request has been submitted successfully!"
        this.requestSuccess = true

        // Reset form
        this.requestForm.reset()
        this.selectedFiles = []
        this.previewUrls = []

        // Redirect after a delay
        setTimeout(() => {
          this.router.navigate(["/my-requests"])
        }, 3000)
      },
      error: (err) => {
        this.isSubmitting = false
        this.errorMessage = err.error?.message || "Failed to submit request. Please try again."
        console.error("Request error:", err)
      },
    })
  }

  // Helper method to get form control error messages
  getErrorMessage(controlName: string): string {
    const control = this.requestForm.get(controlName)
    if (!control || !control.errors || !control.touched) return ""

    if (control.errors["required"]) return `This field is required`
    if (control.errors["min"]) return `Amount must be at least $1`
    if (control.errors["minlength"]) return `Description must be at least 10 characters`

    return "Invalid input"
  }
}
