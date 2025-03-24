import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DonationResponseDTO} from '../models/donation.model';
import {PaginatedResponse} from './user.service';
import {ActionStatusDTO} from '../models/action.model';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = 'http://localhost:8080/api/v1/donations';

  constructor(private http: HttpClient) {}

  createDonation(formData: FormData): Observable<DonationResponseDTO> {
    return this.http.post<DonationResponseDTO>(this.apiUrl, formData);
  }

  getMyDonations(page: number = 0, size: number = 10): Observable<DonationResponseDTO[]> {
    return this.http.get<DonationResponseDTO[]>(`${this.apiUrl}/myDonations?page=${page}&size=${size}`);
  }

  getAllDonations(page: number = 0, size: number = 10): Observable<PaginatedResponse<DonationResponseDTO>> {
    return this.http.get<PaginatedResponse<DonationResponseDTO>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  updateDonation(id: number, formData: FormData): Observable<DonationResponseDTO> {
    return this.http.put<DonationResponseDTO>(`${this.apiUrl}/${id}`, formData)
  }

  updateDonationStatus(id: number, statusData: ActionStatusDTO): Observable<DonationResponseDTO> {
    return this.http.patch<DonationResponseDTO>(`${this.apiUrl}/${id}/status`, statusData)
  }

  getDonationById(id: number): Observable<DonationResponseDTO> {
    return this.http.get<DonationResponseDTO>(`${this.apiUrl}/${id}`)
  }

  deleteDonation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
