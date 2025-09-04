import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, delay, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isTokenValid());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    if ((environment as any).useMockAuth) {
      return this.mockLogin(credentials);
    }

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    if ((environment as any).useMockAuth) {
      return this.mockRegister(userData);
    }

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Register error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user ? user.role : '';
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() < expiry;
    } catch {
      return false;
    }
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    const email = credentials.email?.toLowerCase();
    const password = credentials.password;

    const accounts = [
      { email: 'admin@pharmacy.sa', password: 'Admin123!', role: 'Admin', fullName: 'مدير النظام' },
      { email: 'pharmacist@pharmacy.sa', password: 'Pharma123!', role: 'Pharmacist', fullName: 'صيدلي' },
      { email: 'customer@pharmacy.sa', password: 'Customer123!', role: 'Customer', fullName: 'عميل' }
    ];

    const found = accounts.find(a => a.email === email && a.password === password);
    if (!found) {
      return throwError(() => ({ status: 401, error: { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' } }));
    }

    const user: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      email: found.email,
      fullName: found.fullName,
      role: found.role,
      isActive: true
    };

    const token = this.createFakeToken(user);

    const response: AuthResponse = {
      token,
      refreshToken: 'fake-refresh-token',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      user
    };

    return of(response).pipe(delay(500));
  }

  private mockRegister(userData: RegisterRequest): Observable<AuthResponse> {
    if (userData.password !== userData.confirmPassword) {
      return throwError(() => ({ status: 400, error: { message: 'كلمات المرور غير متطابقة' } }));
    }

    const user: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      phoneNumber: userData.phoneNumber,
      isActive: true
    };

    const token = this.createFakeToken(user);

    const response: AuthResponse = {
      token,
      refreshToken: 'fake-refresh-token',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      user
    };

    return of(response).pipe(delay(500));
  }

  private createFakeToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 86400,
      sub: user.id,
      role: user.role,
      email: user.email
    }));
    return `${header}.${payload}.fake-signature`;
  }
}