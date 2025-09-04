import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    // Clone the request and add authorization header if token exists
    if (token && this.authService.isTokenValid()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
        
        if (error.status === 401) {
          // Token expired or invalid
          this.authService.logout();
          this.router.navigate(['/login']);
          this.snackBar.open('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى', 'إغلاق', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
        } else if (error.status === 0) {
          // Network error
          this.snackBar.open('تعذر الاتصال بالخادم، يرجى التحقق من الاتصال', 'إغلاق', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        
        return throwError(() => error);
      })
    );
  }
}