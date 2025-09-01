import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { UserRole } from '../../../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  returnUrl = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Redirect if already logged in
    if (this.authService.isAuthenticated) {
      this.redirectUser();
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(`مرحباً ${response.user.firstName}، تم تسجيل الدخول بنجاح`);
        this.redirectUser();
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'حدث خطأ أثناء تسجيل الدخول';
        this.notificationService.showError(errorMessage);
      }
    });
  }

  private redirectUser(): void {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.router.navigate(['/home']);
      return;
    }

    // Redirect based on return URL or user role
    if (this.returnUrl && this.returnUrl !== '/') {
      this.router.navigate([this.returnUrl]);
    } else {
      switch (user.role) {
        case UserRole.ADMIN:
          this.router.navigate(['/dashboard/overview']);
          break;
        case UserRole.PHARMACIST:
          this.router.navigate(['/dashboard/pharmacist']);
          break;
        case UserRole.CUSTOMER:
          this.router.navigate(['/dashboard/customer']);
          break;
        default:
          this.router.navigate(['/home']);
      }
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  // Getter methods for template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(controlName)} مطلوب`;
    }
    if (control?.hasError('email')) {
      return 'البريد الإلكتروني غير صحيح';
    }
    if (control?.hasError('minlength')) {
      return `${this.getFieldLabel(controlName)} يجب أن يحتوي على 6 أحرف على الأقل`;
    }
    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور'
    };
    return labels[controlName] || controlName;
  }
}