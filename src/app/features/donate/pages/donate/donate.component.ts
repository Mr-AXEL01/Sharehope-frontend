import {type AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core"
import {CommonModule} from "@angular/common"
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms"
import {Router, RouterModule} from "@angular/router"
import {loadStripe} from "@stripe/stripe-js"
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';
import {AlertComponent} from '../../../../shared/components/alert/alert.component';
import {CategoryResponseDTO} from '../../../../core/models/category.model';
import {CategoryService} from '../../../../core/services/category.service';
import {DonationService} from '../../../../core/services/donation.service';

@Component({
  selector: "app-donate",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent, AlertComponent],
  templateUrl: "./donate.component.html",
})
export class DonateComponent implements OnInit, AfterViewInit {
  donateForm: FormGroup
  categories: CategoryResponseDTO[] = []
  stripePromise = loadStripe(
    "pk_test_51R1QLbQBNW766ArvDIHNWPltIJsnWo6L4f7WH55qHZa5q05oSPZYtVjjlP6I4FQJHt5W6BfAfGSGyQiWWWx7v6sp00ObVk8D49",
  )
  elements: any
  card: any
  isLoading = false
  isSubmitting = false
  errorMessage: string | null = null
  successMessage: string | null = null
  selectedFiles: File[] = []
  previewUrls: string[] = []
  showPaymentElement = false
  paymentProcessing = false
  paymentSuccess = false

  @ViewChild("cardElement") cardElementRef!: ElementRef

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private donationService: DonationService,
    private router: Router,
  ) {
    this.donateForm = this.fb.group({
      categoryId: ["", Validators.required],
      amount: [0, []],
      description: ["", [Validators.required, Validators.minLength(10)]],
      attachments: [null],
    })
  }

  ngOnInit(): void {
    this.loadCategories()
  }

  ngAfterViewInit(): void {
    // We'll initialize Stripe after the view is initialized
    setTimeout(() => {
      this.initializeStripe()
    }, 500)
  }

  initializeStripe(): void {
    this.stripePromise.then((stripe) => {
      if (stripe) {
        this.elements = stripe.elements()
        this.card = this.elements.create("card", {
          style: {
            base: {
              color: "#32325d",
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#fa755a",
              iconColor: "#fa755a",
            },
          },
        })

        // Mount the card element to the DOM if the element exists
        if (this.cardElementRef && this.cardElementRef.nativeElement) {
          this.card.mount(this.cardElementRef.nativeElement)

          // Listen for changes in the card element
          this.card.on("change", (event: any) => {
            const displayError = document.getElementById("card-errors")
            if (displayError) {
              displayError.textContent = event.error ? event.error.message : ""
            }
          })
        }
      }
    })
  }

  loadCategories(): void {
    this.isLoading = true
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories
        this.isLoading = false
        if (this.categories.length > 0) {
          this.donateForm.patchValue({ categoryId: this.categories[0].id })
          this.onCategoryChange()
        }
      },
      error: (error) => {
        console.error("Error loading categories", error)
        this.errorMessage = "Failed to load donation categories. Please try again later."
        this.isLoading = false
      },
    })
  }

  onCategoryChange(): void {
    const categoryId = this.donateForm.get("categoryId")?.value
    const selectedCategory = this.categories.find((c) => c.id === Number(categoryId))
    const isFinancial = selectedCategory?.categoryName === "Financial"

    if (isFinancial) {
      this.donateForm.get("amount")?.setValidators([Validators.required, Validators.min(1)])
      this.showPaymentElement = true
    } else {
      this.donateForm.get("amount")?.clearValidators()
      this.donateForm.get("amount")?.setValue(0)
      this.showPaymentElement = false
    }
    this.donateForm.get("amount")?.updateValueAndValidity()
  }

  onAmountChange(): void {
    const categoryId = this.donateForm.get("categoryId")?.value
    const selectedCategory = this.categories.find((c) => c.id === Number(categoryId))
    const isFinancial = selectedCategory?.categoryName === "Financial"
    const amount = this.donateForm.get("amount")?.value

    this.showPaymentElement = isFinancial && amount > 0
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

  submitDonation(): void {
    if (this.donateForm.invalid || this.isSubmitting) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.donateForm.controls).forEach((key) => {
        this.donateForm.get(key)?.markAsTouched()
      })
      return;
    }

    this.isSubmitting = true
    this.errorMessage = null
    this.successMessage = null

    // Create FormData for the donation
    const formData = new FormData()
    formData.append("categoryId", this.donateForm.value.categoryId.toString())
    formData.append("amount", this.donateForm.value.amount.toString())
    formData.append("description", this.donateForm.value.description)

    // Append files if any
    this.selectedFiles.forEach((file) => {
      formData.append("attachments", file)
    })

    // Submit donation
    this.donationService.createDonation(formData).subscribe({
      next: (response) => {
        if (response.amount > 0 && response.paymentIntentClientSecret) {
          // If there's a payment to process
          this.handlePayment(response.paymentIntentClientSecret)
        } else {
          // If no payment needed (non-financial donation)
          this.isSubmitting = false
          this.successMessage = "Donation created successfully!"
          this.paymentSuccess = true

          // Reset form
          this.donateForm.reset()
          this.selectedFiles = []
          this.previewUrls = []

          // Redirect after a delay
          setTimeout(() => {
            this.router.navigate(["/my-donations"])
          }, 3000)
        }
      },
      error: (err) => {
        this.isSubmitting = false
        this.errorMessage = err.error?.message || "Failed to create donation. Please try again."
        console.error("Donation error:", err)
      },
    })
  }

  handlePayment(clientSecret: string): void {
    this.paymentProcessing = true

    this.stripePromise.then((stripe) => {
      if (stripe) {
        stripe
          .confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.card,
              billing_details: {
                name: "ShareHope User", // Ideally this would be the user's actual name
              },
            },
          })
          .then((result) => {
            this.paymentProcessing = false

            if (result.error) {
              // Show error to your customer
              this.errorMessage = result.error.message || "Payment failed. Please try again."
              this.isSubmitting = false
            } else {
              if (result.paymentIntent.status === "succeeded") {
                // Payment succeeded
                this.successMessage = "Thank you for your donation! Your payment was successful."
                this.paymentSuccess = true
                this.isSubmitting = false

                // Reset form
                this.donateForm.reset()
                this.selectedFiles = []
                this.previewUrls = []

                // Redirect after a delay
                setTimeout(() => {
                  this.router.navigate(["/my-donations"])
                }, 3000)
              }
            }
          })
      }
    })
  }

  // Helper method to get form control error messages
  getErrorMessage(controlName: string): string {
    const control = this.donateForm.get(controlName)
    if (!control || !control.errors || !control.touched) return ""

    if (control.errors["required"]) return `This field is required`
    if (control.errors["min"]) return `Amount must be at least $1`
    if (control.errors["minlength"]) return `Description must be at least 10 characters`

    return "Invalid input"
  }

  // FAQs
  faqs = [
    {
      question: "How is my donation used?",
      answer:
        "At least 85% of your donation goes directly to medical aid. The remaining 15% covers essential operational costs, including platform maintenance, security, and verification processes to ensure your donation reaches those who need it most.",
      isOpen: false,
    },
    {
      question: "Is my donation tax-deductible?",
      answer:
        "Yes, ShareHope is a registered 501(c)(3) nonprofit organization, and all donations are tax-deductible to the extent allowed by law. You will receive a receipt for your donation that you can use for tax purposes.",
      isOpen: false,
    },
    {
      question: "Can I specify where my donation goes?",
      answer:
        "Yes, you can select a specific category for your donation. This helps us direct your contribution to the areas that align with your preferences, whether that's medical supplies, surgeries, or healthcare access programs.",
      isOpen: false,
    },
    {
      question: "Is my donation tax-deductible?",
      answer:
        "Yes, ShareHope is a registered 501(c)(3) nonprofit organization, and all donations are tax-deductible to the extent allowed by law.",
      isOpen: false,
    },
  ]

  // Toggle FAQ
  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen
  }
}

