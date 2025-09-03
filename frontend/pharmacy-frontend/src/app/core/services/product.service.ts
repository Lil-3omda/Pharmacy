import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  name: string;
  nameArabic: string;
  description: string;
  descriptionArabic: string;
  barcode: string;
  price: number;
  stockQuantity: number;
  minimumStockLevel: number;
  manufacturer: string;
  manufacturerArabic: string;
  expiryDate: string;
  imageUrl: string;
  requiresPrescription: boolean;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  categoryNameArabic: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(params?: any): Observable<{ products: Product[], totalCount: number }> {
    if ((environment as any).useMockAuth) {
      return this.getMockProducts();
    }
    return this.http.get<{ products: Product[], totalCount: number }>(this.apiUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductByBarcode(barcode: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/barcode/${barcode}`);
  }

  private getMockProducts(): Observable<{ products: Product[], totalCount: number }> {
    const products: Product[] = [
      {
        id: 1,
        name: 'Paracetamol',
        nameArabic: 'باراسيتامول',
        description: 'Pain reliever and fever reducer',
        descriptionArabic: 'مسكن للألم وخافض للحرارة',
        barcode: 'PH123456789',
        price: 15.50,
        stockQuantity: 100,
        minimumStockLevel: 10,
        manufacturer: 'PharmaCorp',
        manufacturerArabic: 'شركة الدواء',
        expiryDate: '2025-12-31',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
        requiresPrescription: false,
        isActive: true,
        categoryId: 1,
        categoryName: 'Pain Relievers',
        categoryNameArabic: 'مسكنات الألم'
      }
    ];

    return of({ products, totalCount: products.length }).pipe(delay(300));
  }
}