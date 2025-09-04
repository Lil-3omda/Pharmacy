import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'إغلاق', {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
      direction: 'rtl'
    });
  }

  showError(message: string, duration: number = 5000) {
    this.snackBar.open(message, 'إغلاق', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
      direction: 'rtl'
    });
  }

  showWarning(message: string, duration: number = 4000) {
    this.snackBar.open(message, 'إغلاق', {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
      direction: 'rtl'
    });
  }

  showInfo(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'إغلاق', {
      duration,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
      direction: 'rtl'
    });
  }
}