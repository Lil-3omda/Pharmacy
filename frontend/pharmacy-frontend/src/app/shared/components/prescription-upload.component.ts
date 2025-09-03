import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrescriptionService } from '../../core/services/prescription.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-prescription-upload',
  templateUrl: './prescription-upload.component.html',
  styleUrls: ['./prescription-upload.component.scss']
})
export class PrescriptionUploadComponent {
  prescriptionForm: FormGroup;
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private snackBar: MatSnackBar
  ) {
    this.prescriptionForm = this.fb.group({
      doctorName: ['', Validators.required],
      patientName: ['', Validators.required],
      prescriptionDate: ['', Validators.required],
      notes: ['']
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async onSubmit(): Promise<void> {
    if (this.prescriptionForm.valid && this.selectedFile) {
      this.uploading = true;
      
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('doctorName', this.prescriptionForm.value.doctorName);
        formData.append('patientName', this.prescriptionForm.value.patientName);
        formData.append('prescriptionDate', this.prescriptionForm.value.prescriptionDate);
        formData.append('notes', this.prescriptionForm.value.notes || '');

        await this.prescriptionService.uploadPrescription(formData).toPromise();
        
        this.snackBar.open('تم رفع الوصفة بنجاح وسيتم مراجعتها قريباً', 'إغلاق', {
          duration: 3000,
          direction: 'rtl'
        });
        
        this.prescriptionForm.reset();
        this.selectedFile = null;
      } catch (error) {
        this.snackBar.open('حدث خطأ في رفع الوصفة', 'إغلاق', {
          duration: 3000,
          direction: 'rtl'
        });
      } finally {
        this.uploading = false;
      }
    }
  }
}