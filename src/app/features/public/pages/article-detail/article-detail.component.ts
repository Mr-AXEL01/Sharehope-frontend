import {Component, OnInit} from '@angular/core';
import {ArticleResponseDTO} from '../../../../core/models/article.model';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ArticleService} from '../../../../core/services/article.service';
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-article-detail',
  imports: [
    RouterLink,
    LoadingSpinnerComponent
  ],
  templateUrl: './article-detail.component.html',
  standalone: true,
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleResponseDTO | null = null
  isLoading = false
  error: string | null = null

  // Placeholder image for stories without attachments
  placeholderImage = "/assets/images/stories/story-detail-placeholder.jpg"

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
  ) {}

  ngOnInit() {
    this.loadArticle()
  }

  loadArticle() {
    this.isLoading = true
    this.error = null

    const id = this.route.snapshot.paramMap.get("id")
    if (!id) {
      this.error = "Story ID not found"
      this.isLoading = false
      return
    }

    this.articleService.getArticleById(Number(id)).subscribe({
      next: (article) => {
        this.article = article
        this.isLoading = false
        // Scroll to top when story loads
        window.scrollTo({ top: 0, behavior: "smooth" })
      },
      error: (error) => {
        console.error("Error loading article", error)
        this.error = "Failed to load the story. It may not exist or has been removed."
        this.isLoading = false
      },
    })
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  getImageUrl(): string {
    if (this.article?.attachments && this.article.attachments.length > 0) {
      return this.article.attachments[0]
    }
    return this.placeholderImage
  }
}
