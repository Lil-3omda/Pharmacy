import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Medicine {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: number;
  categoryNameAr: string;
  price: number;
  stock: number;
  expiryDate: string;
  imageUrl: string;
  isActive: boolean;
}

export interface MedicineFilter {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  expiringSoon?: boolean;
   prescriptionRequired?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private apiUrl = `${environment.apiUrl}/medicines`;

  constructor(private http: HttpClient) {}

  getMedicines(filter?: MedicineFilter): Observable<Medicine[]> {
    if ((environment as any).useMockAuth) {
      return this.getMockMedicines(filter);
    }

    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Medicine[]>(this.apiUrl, { params });
  }

  getMedicine(id: number): Observable<Medicine> {
    if ((environment as any).useMockAuth) {
      return this.getMockMedicine(id);
    }
    return this.http.get<Medicine>(`${this.apiUrl}/${id}`);
  }

  createMedicine(medicine: any): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiUrl, medicine);
  }

  updateMedicine(id: number, medicine: any): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.apiUrl}/${id}`, medicine);
  }

  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private getMockMedicines(filter?: MedicineFilter): Observable<Medicine[]> {
    const mockMedicines: Medicine[] = [
      {
        id: 1,
        nameAr: 'باراسيتامول',
        nameEn: 'Paracetamol',
        descriptionAr: 'مسكن للألم وخافض للحرارة',
        descriptionEn: 'Pain reliever and fever reducer',
        categoryId: 1,
        categoryNameAr: 'مسكنات الألم',
        price: 15.50,
        stock: 100,
        expiryDate: '2025-12-31',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
        isActive: true
      },
      {
        id: 2,
        nameAr: 'أموكسيسيلين',
        nameEn: 'Amoxicillin',
        descriptionAr: 'مضاد حيوي واسع الطيف',
        descriptionEn: 'Broad-spectrum antibiotic',
        categoryId: 2,
        categoryNameAr: 'مضادات حيوية',
        price: 25.75,
        stock: 75,
        expiryDate: '2025-10-15',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
        isActive: true
      },
      {
        id: 3,
        nameAr: 'فيتامين سي',
        nameEn: 'Vitamin C',
        descriptionAr: 'مكمل غذائي لتقوية المناعة',
        descriptionEn: 'Immune system booster',
        categoryId: 3,
        categoryNameAr: 'فيتامينات',
        price: 35.00,
        stock: 50,
        expiryDate: '2026-03-20',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
        isActive: true
      },
      {
        id: 4,
        nameAr: 'كريم ترطيب',
        nameEn: 'Moisturizing Cream',
        descriptionAr: 'كريم ترطيب للبشرة الجافة',
        descriptionEn: 'Moisturizing cream for dry skin',
        categoryId: 4,
        categoryNameAr: 'مستحضرات تجميل',
        price: 45.25,
        stock: 30,
        expiryDate: '2025-08-10',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
        isActive: true
      }
    ];

    let filteredMedicines = mockMedicines;

    if (filter) {
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filteredMedicines = filteredMedicines.filter(m => 
          m.nameAr.toLowerCase().includes(term) || 
          m.nameEn.toLowerCase().includes(term)
        );
      }
      if (filter.categoryId) {
        filteredMedicines = filteredMedicines.filter(m => m.categoryId === filter.categoryId);
      }
      if (filter.minPrice) {
        filteredMedicines = filteredMedicines.filter(m => m.price >= filter.minPrice!);
      }
      if (filter.maxPrice) {
        filteredMedicines = filteredMedicines.filter(m => m.price <= filter.maxPrice!);
      }
      if (filter.inStock) {
        filteredMedicines = filteredMedicines.filter(m => m.stock > 0);
      }
    }

    return of(filteredMedicines).pipe(delay(300));
  }

  private getMockMedicine(id: number): Observable<Medicine> {
    const mockMedicine: Medicine = {
      id: id,
      nameAr: 'باراسيتامول',
      nameEn: 'Paracetamol',
      descriptionAr: 'مسكن للألم وخافض للحرارة. يستخدم لعلاج الصداع وآلام الجسم والحمى.',
      descriptionEn: 'Pain reliever and fever reducer. Used for headaches, body aches, and fever.',
      categoryId: 1,
      categoryNameAr: 'مسكنات الألم',
      price: 15.50,
      stock: 100,
      expiryDate: '2025-12-31',
      imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
      isActive: true
    };

    return of(mockMedicine).pipe(delay(300));
  }
}