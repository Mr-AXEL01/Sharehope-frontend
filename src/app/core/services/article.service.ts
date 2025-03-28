import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ArticleProjectionDTO, ArticleResponseDTO, PaginatedResponse} from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/api/v1/articles';

  constructor(private http: HttpClient) {
  }

  getAllArticles(page: number = 0, size: number = 10): Observable<PaginatedResponse<ArticleProjectionDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse<ArticleProjectionDTO>>(this.apiUrl, {params});
  }

  getArticleById(id: number): Observable<ArticleResponseDTO> {
    return this.http.get<ArticleResponseDTO>(`${this.apiUrl}/${id}`);
  }

  createArticle(formData: FormData): Observable<ArticleResponseDTO> {
    return this.http.post<ArticleResponseDTO>(this.apiUrl, formData)
  }

  updateArticle(id: number, formData: FormData): Observable<ArticleResponseDTO> {
    return this.http.put<ArticleResponseDTO>(`${this.apiUrl}/${id}`, formData)
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
