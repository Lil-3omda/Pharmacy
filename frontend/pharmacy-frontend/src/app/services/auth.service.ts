import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiResponse, 
  UserRole 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'pharmacy_access_token';
  private readonly REFRESH_TOKEN_KEY = 'pharmacy_refresh_token';
  private readonly USER_KEY = 'pharmacy_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  public login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        }),
        tap(authResponse => {
          this.setAuthData(authResponse);
        })
      );
  }

  public register(userData: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe();
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  public forgotPassword(email: string): Observable<string> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/forgot-password`, { email })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.message;
        })
      );
  }

  public resetPassword(token: string, newPassword: string): Observable<string> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/reset-password`, {
      token,
      newPassword
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.message;
      })
    );
  }

  public verifyEmail(token: string): Observable<string> {
    return this.http.get<ApiResponse>(`${environment.apiUrl}/auth/verify-email?token=${token}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.message;
        })
      );
  }

  public refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('لا يوجد رمز تحديث');
    }

    return this.http.post<ApiResponse<{ accessToken: string }>>(`${environment.apiUrl}/auth/refresh-token`, {
      refreshToken
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data!.accessToken;
      }),
      tap(accessToken => {
        localStorage.setItem(this.TOKEN_KEY, accessToken);
      }),
      catchError(() => {
        this.logout();
        return of('');
      })
    );
  }

  public getProfile(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/auth/profile`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        }),
        tap(user => {
          this.currentUserSubject.next(user);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        })
      );
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
    
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Getter methods
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public get refreshTokenValue(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Role checking methods
  public hasRole(role: UserRole): boolean {
    const user = this.currentUserValue;
    return user ? user.role === role : false;
  }

  public hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.includes(user.role) : false;
  }

  public isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  public isPharmacist(): boolean {
    return this.hasRole(UserRole.PHARMACIST);
  }

  public isCustomer(): boolean {
    return this.hasRole(UserRole.CUSTOMER);
  }

  public canManageMedicines(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.PHARMACIST]);
  }

  public canManageOrders(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.PHARMACIST]);
  }
}