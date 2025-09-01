import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Medicine {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: number;
  category: Category;
  price: number;
  stock: number;
  expiryDate: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
}

export interface MedicineFilter {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  expiringSoon?: boolean;
}

export interface MedicineCreateRequest {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: number;
  price: number;
  stock: number;
  expiryDate: string;
  imageUrl: string;
}

export interface MedicineUpdateRequest {
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  categoryId?: number;
  price?: number;
  stock?: number;
  expiryDate?: string;
  imageUrl?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private apiUrl = `${environment.apiUrl}/medicines`;

  constructor(private http: HttpClient) {}

  getMedicines(filter?: MedicineFilter): Observable<Medicine[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.searchTerm) {
        params = params.set('searchTerm', filter.searchTerm);
      }
      if (filter.categoryId) {
        params = params.set('categoryId', filter.categoryId.toString());
      }
      if (filter.minPrice) {
        params = params.set('minPrice', filter.minPrice.toString());
      }
      if (filter.maxPrice) {
        params = params.set('maxPrice', filter.maxPrice.toString());
      }
      if (filter.inStock) {
        params = params.set('inStock', filter.inStock.toString());
      }
      if (filter.expiringSoon) {
        params = params.set('expiringSoon', filter.expiringSoon.toString());
      }
    }

    return this.http.get<Medicine[]>(this.apiUrl, { params });
  }

  getMedicine(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/${id}`);
  }

  createMedicine(medicine: MedicineCreateRequest): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiUrl, medicine);
  }

  updateMedicine(id: number, medicine: MedicineUpdateRequest): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.apiUrl}/${id}`, medicine);
  }

  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStock(id: number, newStock: number): Observable<Medicine> {
    return this.http.patch<Medicine>(`${this.apiUrl}/${id}/stock`, { stock: newStock });
  }

  getLowStockMedicines(threshold: number = 10): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.apiUrl}/low-stock`, {
      params: { threshold: threshold.toString() }
    });
  }

  getExpiringMedicines(days: number = 30): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.apiUrl}/expiring`, {
      params: { days: days.toString() }
    });
  }
}