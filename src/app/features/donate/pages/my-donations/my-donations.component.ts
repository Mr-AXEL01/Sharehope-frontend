import {Component, OnInit} from '@angular/core';
import {DonationResponseDTO} from '../../../../core/models/donation.model';
import {DonationService} from '../../../../core/services/donation.service';
import {DatePipe} from '@angular/common';
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';
import {AlertComponent} from '../../../../shared/components/alert/alert.component';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {TruncatePipe} from '../../../../shared/pipes/truncate.pipe';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-my-donations',
  imports: [
    LoadingSpinnerComponent,
    AlertComponent,
    FormsModule,
    RouterLink,
    TruncatePipe
  ],
  templateUrl: './my-donations.component.html',
  standalone: true,
  styleUrl: './my-donations.component.css'
})
export class MyDonationsComponent implements OnInit {
  donations: DonationResponseDTO[] = []
  filteredDonations: DonationResponseDTO[] = []
  isLoading = false
  error: string | null = null
  currentPage = 0
  pageSize = 10
  totalItems = 0
  totalPages = 0
  selectedDonation: DonationResponseDTO | null = null
  showDetailModal = false

  // Filters
  statusFilter = "all"
  dateFilter = "all"
  searchQuery = ""

  constructor(
    private donationService: DonationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadDonations()
  }

  loadDonations(): void {
    this.isLoading = true
    this.error = null

    this.donationService.getMyDonations(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.donations = response
        this.filteredDonations = [...this.donations]
        this.isLoading = false

        // For demo purposes, we'll set a total count based on the response
        // In a real app, the backend should provide this information
        this.totalItems = response.length > 0 ? response.length + 10 : 0
        this.totalPages = Math.ceil(this.totalItems / this.pageSize)
      },
      error: (err) => {
        this.isLoading = false
        this.error = "Failed to load your donations. Please try again later."
        console.error("Error loading donations:", err)
      },
    })
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page
      this.loadDonations()
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  viewDonationDetails(donation: DonationResponseDTO): void {
    this.selectedDonation = donation
    this.showDetailModal = true
  }

  closeDetailModal(): void {
    this.showDetailModal = false
    this.selectedDonation = null
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "DELIVERED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getStatusIcon(status: string): SafeHtml {
    let svg = '';

    switch (status) {
      case "CONFIRMED":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
               </svg>`;
        break;
      case "PENDING":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>`;
        break;
      case "DELIVERED":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l1.5-4.5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.5L21 10M3 10h18m-2 0v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8m2 0h10" />
               </svg>`;
        break;
      default:
        svg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })
  }

  applyFilters(): void {
    // Start with all donations
    this.filteredDonations = [...this.donations];

    // Apply status filter if not "all"
    if (this.statusFilter !== "all") {
      this.filteredDonations = this.filteredDonations.filter(
        (donation) => donation.donationStatus === this.statusFilter,
      );
    }

    // Apply date filter
    if (this.dateFilter !== "all") {
      const now = new Date();
      let startDate = new Date(); // Will be modified based on filter selection

      // Calculate startDate based on selected date filter
      switch (this.dateFilter) {
        case "last-day":
          startDate.setDate(now.getDate() - 1);
          break;
        case "last-week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "last-month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "last-year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          // If unknown filter, show all donations
          startDate = new Date(0);
      }

      // Filter donations that occurred between startDate and now
      this.filteredDonations = this.filteredDonations.filter((donation) => {
        const donationDate = new Date(donation.createdAt);
        return donationDate >= startDate && donationDate <= now;
      });
    }

    // Apply search query
    if (this.searchQuery.trim() !== "") {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredDonations = this.filteredDonations.filter(
        (donation) =>
          donation.description.toLowerCase().includes(query) ||
          donation.category.categoryName.toLowerCase().includes(query) ||
          donation.id.toString().includes(query),
      );
    }

    // Reset pagination if needed
    this.currentPage = 0;
  }

  resetFilters(): void {
    this.statusFilter = "all"
    this.dateFilter = "all"
    this.searchQuery = ""
    this.filteredDonations = [...this.donations]
  }
}
