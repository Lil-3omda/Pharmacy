import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isTokenValid()) {
      this.redirectBasedOnRole();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('تم تسجيل الدخول بنجاح', 'إغلاق', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.redirectBasedOnRole();
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';

          if (error.status === 0) {
            errorMessage = 'تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم (API) والتحقق من الاتصال الآمن (SSL).';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (typeof error.error === 'string' && error.error.trim().length > 0) {
            errorMessage = error.error;
          }

          this.snackBar.open(errorMessage, 'إغلاق', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  fillDemoAccount(type: 'admin' | 'pharmacist' | 'customer') {
    const accounts = {
      admin: { email: 'admin@pharmacy.sa', password: 'Admin123!' },
      pharmacist: { email: 'pharmacist@pharmacy.sa', password: 'Pharma123!' },
      customer: { email: 'customer@pharmacy.sa', password: 'Customer123!' }
    };

    const account = accounts[type];
    this.loginForm.patchValue({
      email: account.email,
      password: account.password
    });
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      switch (user.role) {
        case 'Admin':
        case 'Pharmacist':
          this.router.navigate(['/admin']);
          break;
        case 'Customer':
        default:
          this.router.navigate(['/home']);
          break;
      }
    }
  }
}