import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {UserService} from "../../../../core/services/user.service";
import {DonationService} from "../../../../core/services/donation.service";
import {NeedService} from "../../../../core/services/need.service";
import {ArticleService} from "../../../../core/services/article.service";
import {AuthService} from "../../../../core";
import {forkJoin} from "rxjs";
import {DonationResponseDTO} from "../../../../core/models/donation.model";
import { NeedResponseDTO } from '../../../../core/models/need.model';

interface DashboardStat {
  label: string
  value: string | number
  icon: string
  trend?: {
    value: string
    isUp: boolean
  }
  color: string
}

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStat[] = []
  recentDonations: DonationResponseDTO[] = []
  recentRequests: NeedResponseDTO[] = []
  isLoading = true

  quickActions = [
    { label: "Create New Article", route: "/dashboard/articles/create", primary: true },
    { label: "Add New User", route: "/dashboard/users/create", primary: true },
    { label: "Create Category", route: "/dashboard/categories/create", primary: true },
    { label: "View All Donations", route: "/dashboard/donations", primary: false },
    { label: "View All Requests", route: "/dashboard/requests", primary: false },
  ]

  constructor(
      private userService: UserService,
      private donationService: DonationService,
      private needService: NeedService,
      private articleService: ArticleService,
      private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData()
  }

  loadDashboardData(): void {
    this.isLoading = true

    // Set default stats until real data is loaded
    this.initializeDefaultStats()

    // Load real data with multiple observables
    forkJoin({
      users: this.userService.getAllUsers(0, 1),
      donations: this.donationService.getAllDonations(0, 5),
      requests: this.needService.getAllNeeds(0, 5),
      articles: this.articleService.getAllArticles(0, 1),
    }).subscribe({
      next: (results) => {
        // Update stats with real data
        this.updateStats(results)
        // Set recent donations and requests
        this.recentDonations = this.recentDonations = Array.isArray(results.donations) ? results.donations : results.donations?.content || [];

        this.recentRequests = results.requests.content

        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading dashboard data:", error)
        this.isLoading = false
      },
    })
  }

  initializeDefaultStats(): void {
    this.stats = [
      {
        label: "Total Users",
        value: 0,
        icon: "users",
        trend: { value: "0%", isUp: true },
        color: "blue",
      },
      {
        label: "Total Donations",
        value: "$0",
        icon: "donations",
        trend: { value: "0%", isUp: true },
        color: "green",
      },
      {
        label: "Aid Requests",
        value: 0,
        icon: "requests",
        trend: { value: "0%", isUp: true },
        color: "purple",
      },
      {
        label: "Success Stories",
        value: 0,
        icon: "articles",
        trend: { value: "0%", isUp: true },
        color: "red",
      },
    ]
  }

  updateStats(data: any): void {
    const donationsArray = data.donations?.content || [];
    const requestsArray = data.requests?.content || [];
    // Update with real data
    this.stats = [
      {
        label: "Total Users",
        value: data.users.totalElements || 0,
        icon: "users",
        trend: { value: "12%", isUp: true },
        color: "blue",
      },
      {
        label: "Total Donations",
        value: this.calculateTotalDonations(donationsArray),
        icon: "donations",
        trend: { value: "8%", isUp: true },
        color: "green",
      },
      {
        label: "Aid Requests",
        value: requestsArray.length || 0,
        icon: "requests",
        trend: { value: "3%", isUp: true },
        color: "purple",
      },
      {
        label: "Success Stories",
        value: data.articles.totalElements || 0,
        icon: "articles",
        trend: { value: "15%", isUp: true },
        color: "red",
      },
    ]
  }

  calculateTotalDonations(donations: any): string {
    if (!Array.isArray(donations) || donations.length === 0) return "$0";

    const total = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
    return "$" + total.toLocaleString();
  }

  getIconSvg(icon: string): string {
    switch (icon) {
      case "users":
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>`
      case "donations":
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>`
      case "requests":
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>`
      case "articles":
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>`
      default:
        return ""
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "FAILED":
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getInitials(name: string): string {
    if (!name) return "UN"
    return name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2)
  }
}
