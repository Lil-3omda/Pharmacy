import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Medicine, ApiResponse, MedicineFilter } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private readonly baseUrl = `${environment.apiUrl}/medicines`;

  constructor(private http: HttpClient) {}

  public getMedicines(filter: MedicineFilter = {}): Observable<ApiResponse<Medicine[]>> {
    let params = new HttpParams();
    
    Object.keys(filter).forEach(key => {
      const value = (filter as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<Medicine[]>>(this.baseUrl, { params });
  }

  public getMedicineById(id: string): Observable<Medicine> {
    return this.http.get<ApiResponse<Medicine>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public searchMedicines(query: string, limit: number = 10): Observable<Medicine[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<Medicine[]>>(`${this.baseUrl}/search`, { params })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data || [];
        })
      );
  }

  public createMedicine(medicineData: FormData): Observable<Medicine> {
    return this.http.post<ApiResponse<Medicine>>(this.baseUrl, medicineData)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public updateMedicine(id: string, medicineData: FormData): Observable<Medicine> {
    return this.http.put<ApiResponse<Medicine>>(`${this.baseUrl}/${id}`, medicineData)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public deleteMedicine(id: string): Observable<string> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.message;
        })
      );
  }

  public getLowStockMedicines(threshold?: number): Observable<Medicine[]> {
    let params = new HttpParams();
    if (threshold) {
      params = params.set('threshold', threshold.toString());
    }

    return this.http.get<ApiResponse<Medicine[]>>(`${this.baseUrl}/admin/low-stock`, { params })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data || [];
        })
      );
  }

  public getExpiringMedicines(days: number = 30): Observable<Medicine[]> {
    const params = new HttpParams().set('days', days.toString());

    return this.http.get<ApiResponse<Medicine[]>>(`${this.baseUrl}/admin/expiring`, { params })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data || [];
        })
      );
  }
}