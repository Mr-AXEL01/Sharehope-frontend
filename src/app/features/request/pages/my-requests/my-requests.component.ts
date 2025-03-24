import {Component, OnInit} from '@angular/core';
import {NeedResponseDTO} from '../../../../core/models/need.model';
import {NeedService} from '../../../../core/services/need.service';
import {NgClass} from '@angular/common';
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';
import {AlertComponent} from '../../../../shared/components/alert/alert.component';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TruncatePipe} from '../../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-my-requests',
  imports: [
    NgClass,
    LoadingSpinnerComponent,
    AlertComponent,
    RouterLink,
    FormsModule,
    TruncatePipe
  ],
  templateUrl: './my-requests.component.html',
  standalone: true,
  styleUrl: './my-requests.component.css'
})
export class MyRequestsComponent implements OnInit {
  requests: NeedResponseDTO[] = []
  filteredRequests: NeedResponseDTO[] = []
  isLoading = false
  error: string | null = null
  currentPage = 0
  pageSize = 10
  totalItems = 0
  totalPages = 0
  selectedRequest: NeedResponseDTO | null = null
  showDetailModal = false

  // Filters
  statusFilter = "all"
  dateFilter = "all"
  searchQuery = ""

  constructor(private needService: NeedService) {}

  ngOnInit(): void {
    this.loadRequests()
  }

  loadRequests(): void {
    this.isLoading = true
    this.error = null

    this.needService.getMyNeeds(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.requests = response
        this.filteredRequests = [...this.requests]
        this.isLoading = false

        // For demo purposes, we'll set a total count based on the response
        // In a real app, the backend should provide this information
        this.totalItems = response.length > 0 ? response.length + 10 : 0
        this.totalPages = Math.ceil(this.totalItems / this.pageSize)
      },
      error: (err) => {
        this.isLoading = false
        this.error = "Failed to load your requests. Please try again later."
        console.error("Error loading requests:", err)
      },
    })
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page
      this.loadRequests()
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  viewRequestDetails(request: NeedResponseDTO): void {
    this.selectedRequest = request
    this.showDetailModal = true
  }

  closeDetailModal(): void {
    this.showDetailModal = false
    this.selectedRequest = null
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "CONFIRMED":
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>`
      case "PENDING":
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>`
      case "REJECTED":
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>`
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>`
    }
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
    this.filteredRequests = [...this.requests]

    // Apply status filter
    if (this.statusFilter !== "all") {
      this.filteredRequests = this.filteredRequests.filter((request) => request.needStatus === this.statusFilter)
    }

    // Apply date filter
    if (this.dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (this.dateFilter) {
        case "last-week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "last-month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "last-year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      this.filteredRequests = this.filteredRequests.filter((request) => {
        const requestDate = new Date(request.createdAt)
        return requestDate >= filterDate
      })
    }

    // Apply search query
    if (this.searchQuery.trim() !== "") {
      const query = this.searchQuery.toLowerCase().trim()
      this.filteredRequests = this.filteredRequests.filter(
        (request) =>
          request.description.toLowerCase().includes(query) ||
          request.category.categoryName.toLowerCase().includes(query) ||
          request.id.toString().includes(query),
      )
    }

    // Reset pagination
    this.currentPage = 0
  }

  resetFilters(): void {
    this.statusFilter = "all"
    this.dateFilter = "all"
    this.searchQuery = ""
    this.filteredRequests = [...this.requests]
  }
}
