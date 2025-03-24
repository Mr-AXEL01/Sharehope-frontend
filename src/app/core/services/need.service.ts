import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NeedResponseDTO} from '../models/need.model';
import {Observable} from 'rxjs';
import {PaginatedResponse} from './user.service';
import {DonationResponseDTO} from '../models/donation.model';

@Injectable({
  providedIn: 'root'
})
export class NeedService {
  private apiUrl = 'http://localhost:8080/api/v1/needs'

  constructor(private http: HttpClient) {}

  createNeed(formData: FormData): Observable<NeedResponseDTO> {
    return this.http.post<NeedResponseDTO>(this.apiUrl, formData)
  }

  getAllNeeds(page: number = 0, size: number = 10): Observable<PaginatedResponse<NeedResponseDTO>> {
    return this.http.get<PaginatedResponse<NeedResponseDTO>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getMyNeeds(page = 0, size = 10): Observable<NeedResponseDTO[]> {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString())
    return this.http.get<NeedResponseDTO[]>(`${this.apiUrl}/myNeeds`, { params })
  }
}
