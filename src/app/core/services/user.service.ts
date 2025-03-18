import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAuthResponse, UserResponse, UserUpdateDTO} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/profile';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  update(id: number, updateData: UserUpdateDTO): Observable<UserAuthResponse> {
    return this.http.put<UserAuthResponse>(`${this.apiUrl}/${id}`, updateData);
  }

  updateAvatar(id: number, file: File): Observable<UserResponse> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.patch<UserResponse>(`${this.apiUrl}/${id}/avatar`, formData);
  }

  updatePassword(id: number, passwordData: { currentPassword: string; newPassword: string }): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.apiUrl}/${id}/password`, passwordData);
  }
}
