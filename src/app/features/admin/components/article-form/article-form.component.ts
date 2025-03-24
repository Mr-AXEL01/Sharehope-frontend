import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ArticleService} from '../../../../core/services/article.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../core';
import {ArticleResponseDTO} from '../../../../core/models/article.model';
import {AlertComponent} from '../../../../shared/components/alert/alert.component';
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-article-form',
  imports: [
    AlertComponent,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './article-form.component.html',
  standalone: true,
  styleUrl: './article-form.component.css'
})
export class ArticleFormComponent implements OnInit {
  articleForm: FormGroup
  isLoading = false
  isSubmitting = false
  error: string | null = null
  success: string | null = null
  isEditMode = false
  articleId: number | null = null
  selectedFiles: File[] = []
  previewUrls: string[] = []
  existingAttachments: string[] = []
  keepAttachments: string[] = []

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService, // Add AuthService to get current user ID
  ) {
    this.articleForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      content: ["", [Validators.required]],
      attachments: [null],
    })
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true
      this.articleId = +id
      this.loadArticle(this.articleId)
    }
  }

  loadArticle(id: number): void {
    this.isLoading = true
    this.error = null

    this.articleService.getArticleById(id).subscribe({
      next: (article: ArticleResponseDTO) => {
        this.articleForm.patchValue({
          title: article.title,
          description: article.description,
          content: article.content,
        })

        // Store existing attachments
        if (article.attachments && article.attachments.length > 0) {
          this.existingAttachments = article.attachments
          this.keepAttachments = [...article.attachments] // Initialize with all attachments
        }

        this.isLoading = false
      },
      error: (err) => {
        this.isLoading = false
        this.error = "Failed to load article. Please try again later."
        console.error("Error loading article:", err)
      },
    })
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
          this.previewUrls.push("/assets/images/file-icon.png")
        }
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1)
    this.previewUrls.splice(index, 1)
  }

  removeExistingAttachment(index: number): void {
    // Remove from keepAttachments array
    const url = this.existingAttachments[index]
    const keepIndex = this.keepAttachments.indexOf(url)
    if (keepIndex !== -1) {
      this.keepAttachments.splice(keepIndex, 1)
    }

    // Remove from display
    this.existingAttachments.splice(index, 1)
  }

  onSubmit(): void {
    if (this.articleForm.invalid || this.isSubmitting) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.articleForm.controls).forEach((key) => {
        this.articleForm.get(key)?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true
    this.error = null
    this.success = null

    // Create FormData for the article
    const formData = new FormData()
    formData.append("title", this.articleForm.value.title)
    formData.append("description", this.articleForm.value.description)
    formData.append("content", this.articleForm.value.content)

    // Append files if any
    this.selectedFiles.forEach((file) => {
      formData.append("attachments", file)
    })

    if (this.isEditMode && this.articleId) {
      // For update, we'll need to handle existing attachments differently
      // This depends on how the backend handles attachment updates
      // You might need to adjust this based on your backend implementation

      // Update existing article
      this.articleService.updateArticle(this.articleId, formData).subscribe({
        next: () => {
          this.isSubmitting = false
          this.success = "Article updated successfully!"

          // Redirect after a delay
          setTimeout(() => {
            this.router.navigate(["/dashboard/articles"])
          }, 2000)
        },
        error: (err) => {
          this.isSubmitting = false
          this.error = err.error?.message || "Failed to update article. Please try again."
          console.error("Error updating article:", err)
        },
      })
    } else {
      // Create new article - get current user ID for authorId
      this.authService.getLoggedInUser().subscribe({
        next: (user) => {
          if (user && user.id) {
            formData.append("authorId", user.id.toString())

            // Create new article
            this.articleService.createArticle(formData).subscribe({
              next: () => {
                this.isSubmitting = false
                this.success = "Article created successfully!"

                // Redirect after a delay
                setTimeout(() => {
                  this.router.navigate(["/dashboard/articles"])
                }, 2000)
              },
              error: (err) => {
                this.isSubmitting = false
                this.error = err.error?.message || "Failed to create article. Please try again."
                console.error("Error creating article:", err)
              },
            })
          } else {
            this.isSubmitting = false
            this.error = "Could not determine the current user. Please try again."
          }
        },
        error: (err) => {
          this.isSubmitting = false
          this.error = "Could not determine the current user. Please try again."
          console.error("Error getting current user:", err)
        },
      })
    }
  }

  // Helper method to get form control error messages
  getErrorMessage(controlName: string): string {
    const control = this.articleForm.get(controlName)
    if (!control || !control.errors || !control.touched) return ""

    if (control.errors["required"]) return `This field is required`
    if (control.errors["minlength"]) {
      const minLength = control.errors["minlength"].requiredLength
      return `This field must be at least ${minLength} characters`
    }
    if (control.errors["maxlength"]) {
      const maxLength = control.errors["maxlength"].requiredLength
      return `This field cannot exceed ${maxLength} characters`
    }

    return "Invalid input"
  }
}
