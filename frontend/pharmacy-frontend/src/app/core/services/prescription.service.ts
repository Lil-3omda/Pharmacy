import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Prescription } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = `${environment.apiUrl}/prescriptions`;

  constructor(private http: HttpClient) {}

  getPrescriptions(): Observable<Prescription[]> {
    if ((environment as any).useMockAuth) {
      return this.getMockPrescriptions();
    }
    return this.http.get<Prescription[]>(this.apiUrl);
  }

  uploadPrescription(formData: FormData): Observable<Prescription> {
    if ((environment as any).useMockAuth) {
      return this.mockUploadPrescription();
    }
    return this.http.post<Prescription>(this.apiUrl, formData);
  }

  updatePrescriptionStatus(id: number, status: string, notes?: string): Observable<Prescription> {
    return this.http.patch<Prescription>(`${this.apiUrl}/${id}/status`, { status, notes });
  }

  private getMockPrescriptions(): Observable<Prescription[]> {
    const mockPrescriptions: Prescription[] = [
      {
        id: 1,
        userId: 'user1',
        doctorName: 'د. أحمد محمد',
        prescriptionDate: '2025-01-15',
        imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
        status: 'Pending',
        notes: 'وصفة طبية لعلاج الالتهاب',
        medicines: [
          {
            medicineId: 1,
            medicineName: 'أموكسيسيلين',
            dosage: '500mg',
            duration: '7 أيام',
            instructions: 'مرتين يومياً بعد الأكل'
          }
        ]
      }
    ];

    return of(mockPrescriptions).pipe(delay(500));
  }

  private mockUploadPrescription(): Observable<Prescription> {
    const mockPrescription: Prescription = {
      id: Date.now(),
      userId: 'current-user',
      doctorName: 'د. محمد أحمد',
      prescriptionDate: new Date().toISOString(),
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
      status: 'Pending',
      medicines: []
    };

    return of(mockPrescription).pipe(delay(1000));
  }
}