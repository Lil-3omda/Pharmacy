import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  public showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'إغلاق', {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  public showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'إغلاق', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  public showWarning(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'إغلاق', {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  public showInfo(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'إغلاق', {
      duration,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}