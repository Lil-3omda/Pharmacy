import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth token if available
    const token = this.authService.token;
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      
      return next.handle(authReq).pipe(
        catchError(error => {
          // If token expired, try to refresh
          if (error.status === 401 && !req.url.includes('/auth/refresh-token')) {
            return this.authService.refreshToken().pipe(
              switchMap(newToken => {
                if (newToken) {
                  const newAuthReq = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                  });
                  return next.handle(newAuthReq);
                }
                return throwError(error);
              }),
              catchError(() => {
                this.authService.logout();
                return throwError(error);
              })
            );
          }
          return throwError(error);
        })
      );
    }

    return next.handle(req);
  }
}