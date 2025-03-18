import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponse, RegisterRequest, UserLogin} from '../../features/auth';
import {Observable, tap} from 'rxjs';
import {UserResponse} from '../models/user.model';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private tokenKey = 'access_token';

  constructor(private readonly http: HttpClient) { }

  register(user: RegisterRequest): Observable<UserResponse> {
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('phone', user.phone);
    if (user.avatar) {
      formData.append('avatar', user.avatar);
    }
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, formData);
  }

  login(credentials: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => localStorage.setItem(this.tokenKey, response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getLoggedInUser(): Observable<UserResponse> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const decodedToken: any = jwtDecode(token);
    return this.http.get<UserResponse>(`http://localhost:8080/api/v1/profile/${decodedToken.userId}`);
  }

  updateToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

}
