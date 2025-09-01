import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'حدث خطأ غير متوقع';

        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Don't show error notifications for certain endpoints
        const silentEndpoints = ['/auth/refresh-token'];
        const shouldShowNotification = !silentEndpoints.some(endpoint => 
          req.url.includes(endpoint)
        );

        if (shouldShowNotification && error.status !== 401) {
          this.notificationService.showError(errorMessage);
        }

        return throwError(error);
      })
    );
  }
}