import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  medicineCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    if ((environment as any).useMockAuth) {
      return this.getMockCategories();
    }
    
    return this.http.get<Category[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching categories:', error);
          return this.getMockCategories();
        })
      );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: any): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: any): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private getMockCategories(): Observable<Category[]> {
    const mockCategories: Category[] = [
      {
        id: 1,
        nameAr: 'مسكنات الألم',
        nameEn: 'Pain Relievers',
        descriptionAr: 'أدوية لتخفيف الألم',
        descriptionEn: 'Medications for pain relief',
        isActive: true,
        medicineCount: 15
      },
      {
        id: 2,
        nameAr: 'مضادات حيوية',
        nameEn: 'Antibiotics',
        descriptionAr: 'أدوية لعلاج الالتهابات البكتيرية',
        descriptionEn: 'Medications for bacterial infections',
        isActive: true,
        medicineCount: 12
      },
      {
        id: 3,
        nameAr: 'فيتامينات',
        nameEn: 'Vitamins',
        descriptionAr: 'مكملات غذائية وفيتامينات',
        descriptionEn: 'Nutritional supplements and vitamins',
        isActive: true,
        medicineCount: 20
      },
      {
        id: 4,
        nameAr: 'مستحضرات تجميل',
        nameEn: 'Cosmetics',
        descriptionAr: 'منتجات العناية بالبشرة والشعر',
        descriptionEn: 'Skin and hair care products',
        isActive: true,
        medicineCount: 8
      }
    ];

    return of(mockCategories).pipe(delay(200));
  }
}