import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrescriptionService } from '../../core/services/prescription.service';
import { NotificationService } from '../../core/services/notification.service';
import { Prescription } from '../../core/models';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss']
})
export class PrescriptionsComponent implements OnInit {
  prescriptions: Prescription[] = [];
  isLoading = true;
  isUploading = false;
  showUploadForm = false;
  
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private prescriptionService: PrescriptionService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {
    this.uploadForm = this.formBuilder.group({
      doctorName: ['', [Validators.required]],
      prescriptionDate: ['', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.isLoading = true;
    
    this.prescriptionService.getPrescriptions().subscribe({
      next: (prescriptions) => {
        this.prescriptions = prescriptions;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.showError('حدث خطأ أثناء تحميل الوصفات');
      }
    });
  }

  openUploadDialog() {
    this.showUploadForm = true;
    this.uploadForm.reset();
    this.selectedFile = null;
    this.previewUrl = null;
  }

  closeUploadDialog() {
    this.showUploadForm = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.showError('حجم الملف يجب أن يكون أقل من 5MB');
        return;
      }
      
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  uploadPrescription() {
    if (this.uploadForm.valid && this.selectedFile) {
      this.isUploading = true;
      
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('doctorName', this.uploadForm.value.doctorName);
      formData.append('prescriptionDate', this.uploadForm.value.prescriptionDate);
      formData.append('notes', this.uploadForm.value.notes || '');

      this.prescriptionService.uploadPrescription(formData).subscribe({
        next: () => {
          this.isUploading = false;
          this.notificationService.showSuccess('تم رفع الوصفة بنجاح');
          this.closeUploadDialog();
          this.loadPrescriptions();
        },
        error: () => {
          this.isUploading = false;
          this.notificationService.showError('حدث خطأ أثناء رفع الوصفة');
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Pending': return 'قيد المراجعة';
      case 'Approved': return 'مؤكدة';
      case 'Rejected': return 'مرفوضة';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      default: return '';
    }
  }
}