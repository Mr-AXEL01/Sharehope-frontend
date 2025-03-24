import {Component, OnInit} from '@angular/core';
import {ArticleProjectionDTO, PaginatedResponse} from '../../../../core/models/article.model';
import {ArticleService} from '../../../../core/services/article.service';
import {RouterLink} from '@angular/router';
import {AlertComponent} from '../../../../shared/components/alert/alert.component';
import {FormsModule} from '@angular/forms';
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';
import {TruncatePipe} from '../../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-article-list',
  imports: [
    RouterLink,
    AlertComponent,
    FormsModule,
    LoadingSpinnerComponent,
    TruncatePipe
  ],
  templateUrl: './article-list.component.html',
  standalone: true,
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent implements OnInit {
  articles: ArticleProjectionDTO[] = []
  filteredArticles: ArticleProjectionDTO[] = []
  isLoading = false
  error: string | null = null
  success: string | null = null
  currentPage = 0
  pageSize = 10
  totalItems = 0
  totalPages = 0
  searchQuery = ""
  showDeleteModal = false
  articleToDelete: ArticleProjectionDTO | null = null
  isDeleting = false

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles()
  }

  loadArticles(): void {
    this.isLoading = true
    this.error = null

    this.articleService.getAllArticles(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<ArticleProjectionDTO>) => {
        this.articles = response.content
        this.filteredArticles = [...this.articles]
        this.totalItems = response.totalElements
        this.totalPages = response.totalPages
        this.isLoading = false
      },
      error: (err) => {
        this.isLoading = false
        this.error = "Failed to load articles. Please try again later."
        console.error("Error loading articles:", err)
      },
    })
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page
      this.loadArticles()
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  applySearch(): void {
    if (this.searchQuery.trim() === "") {
      this.filteredArticles = [...this.articles]
      return
    }

    const query = this.searchQuery.toLowerCase().trim()
    this.filteredArticles = this.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.author.username.toLowerCase().includes(query),
    )
  }

  resetSearch(): void {
    this.searchQuery = ""
    this.filteredArticles = [...this.articles]
  }

  confirmDelete(article: ArticleProjectionDTO): void {
    this.articleToDelete = article
    this.showDeleteModal = true
  }

  cancelDelete(): void {
    this.articleToDelete = null
    this.showDeleteModal = false
  }

  deleteArticle(): void {
    if (!this.articleToDelete) return

    this.isDeleting = true
    this.articleService.deleteArticle(this.articleToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false
        this.showDeleteModal = false
        this.success = "Article deleted successfully."

        // Remove the deleted article from the arrays
        this.articles = this.articles.filter((a) => a.id !== this.articleToDelete?.id)
        this.filteredArticles = this.filteredArticles.filter((a) => a.id !== this.articleToDelete?.id)
        this.articleToDelete = null

        // Reload if the page is now empty (except for the first page)
        if (this.articles.length === 0 && this.currentPage > 0) {
          this.currentPage--
          this.loadArticles()
        }

        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          this.success = null
        }, 3000)
      },
      error: (err) => {
        this.isDeleting = false
        this.error = err.error?.message || "Failed to delete article. Please try again."
        this.showDeleteModal = false

        // Auto-dismiss error message after 5 seconds
        setTimeout(() => {
          this.error = null
        }, 5000)
      },
    })
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

