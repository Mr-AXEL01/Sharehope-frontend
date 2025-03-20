import {Component, OnInit} from '@angular/core';
import {ArticleProjectionDTO, PaginatedResponse} from '../../../../core/models/article.model';
import {ArticleService} from '../../../../core/services/article.service';
import {RouterLink} from '@angular/router';
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-articles',
  imports: [
    RouterLink,
    LoadingSpinnerComponent
  ],
  templateUrl: './articles.component.html',
  standalone: true,
  styleUrl: './articles.component.css'
})
export class ArticlesComponent implements OnInit {
  articles: ArticleProjectionDTO[] = []
  currentPage = 0
  totalPages: number = 0
  pageSize = 10
  isLoading = false
  error: string | null = null

  // Placeholder images for stories without attachments
  placeholderImages = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ]

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.loadArticles()
  }

  loadArticles() {
    this.isLoading = true
    this.error = null

    this.articleService.getAllArticles(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<ArticleProjectionDTO>) => {
        this.articles = response.content
        this.totalPages = response.totalPages
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading articles", error)
        this.error = "Failed to load success stories. Please try again later."
        this.isLoading = false
      },
    })
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }


  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page
      this.loadArticles()
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  getPlaceholderImage(index: number): string {
    return this.placeholderImages[index % this.placeholderImages.length]
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  protected readonly Array = Array;
}
