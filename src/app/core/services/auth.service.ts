import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponse, RegisterRequest, UserLogin} from '../../features/auth';
import {Observable, tap} from 'rxjs';
import {UserResponse} from '../models/user.model';
import {jwtDecode} from 'jwt-decode';
import {Router} from '@angular/router';
import {CustomJwtPayload} from '../models/jwt.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private tokenKey = 'access_token';
  private token: string | null = null;
  private roles: string[] = [];

  constructor(
    private readonly http: HttpClient,
    private router: Router,
  ) { }

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

  loginAndRedirect(credentials: UserLogin): void {
    this.login(credentials).subscribe({
      next: () => {
        this.getRoles();

        if (this.isAdmin()) {
          this.router.navigate(['/dashboard']);
        } else if (this.isUser()) {
          this.router.navigate(['/profile']);
        } else {
          this.router.navigate(['/auth/login']);
        }
      },
      error: err => {
        console.error('Login failed:', err);
      }
    });
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

  getRoles() {
    this.token = this.getToken();
    if (this.token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(this.token);
      this.roles = Array.isArray(decodedToken.roles)
        ? decodedToken.roles.map(role => (typeof role === 'string' ? role : role.role))
        : [];
    } else {
      this.roles = [];
    }
  }

  hasRole(requiredRole: string): boolean {
    return this.roles.includes(requiredRole);
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isUser(): boolean {
    return this.hasRole('ROLE_USER');
  }
}
