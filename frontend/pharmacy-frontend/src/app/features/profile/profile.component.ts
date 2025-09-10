import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  isEditMode = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['']
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.fetchProfile();
  }

  private fetchProfile() {
    this.isLoading = true;
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber || ''
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('تعذر تحميل الملف الشخصي', 'إغلاق', { duration: 3000 });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode && this.currentUser) {
      // Reset form if canceling edit
      this.profileForm.patchValue({
        fullName: this.currentUser.fullName,
        email: this.currentUser.email,
        phoneNumber: this.currentUser.phoneNumber || ''
      });
    }
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;

      // Typically backend exposes PUT /api/Auth/profile or similar; since we only have GET profile
      // provided, we will simply update local state here to keep UI consistent.
      const updated = { ...this.currentUser, ...this.profileForm.value } as User;
      localStorage.setItem('user', JSON.stringify(updated));
      this.isLoading = false;
      this.isEditMode = false;
      this.currentUser = updated;
      this.snackBar.open('تم تحديث الملف الشخصي بنجاح', 'إغلاق', { duration: 3000 });
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      const req = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };
      this.authService.changePassword(req).subscribe({
        next: () => {
          this.isLoading = false;
          this.passwordForm.reset();
          this.snackBar.open('تم تغيير كلمة المرور بنجاح', 'إغلاق', { duration: 3000 });
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('تعذر تغيير كلمة المرور', 'إغلاق', { duration: 3000 });
        }
      });
    }
  }

  getErrorMessage(formName: 'profile' | 'password', fieldName: string): string {
    const form = formName === 'profile' ? this.profileForm : this.passwordForm;
    const field = form.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'هذا الحقل مطلوب';
    }
    if (field?.hasError('email')) {
      return 'يرجى إدخال بريد إلكتروني صحيح';
    }
    if (field?.hasError('minlength')) {
      return 'يجب أن يكون طول كلمة المرور 6 أحرف على الأقل';
    }
    if (field?.hasError('passwordMismatch')) {
      return 'كلمات المرور غير متطابقة';
    }
    return '';
  }
}