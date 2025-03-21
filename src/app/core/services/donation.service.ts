import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DonationResponseDTO} from '../models/donation.model';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = 'http://localhost:8080/api/v1/donations';

  constructor(private http: HttpClient) {}

  createDonation(formData: FormData): Observable<DonationResponseDTO> {
    return this.http.post<DonationResponseDTO>(this.apiUrl, formData);
  }
}
