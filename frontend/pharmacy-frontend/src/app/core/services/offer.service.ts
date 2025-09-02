import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Offer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = `${environment.apiUrl}/offers`;

  constructor(private http: HttpClient) {}

  getActiveOffers(): Observable<Offer[]> {
    if ((environment as any).useMockAuth) {
      return this.getMockOffers();
    }
    return this.http.get<Offer[]>(`${this.apiUrl}/active`);
  }

  getOffer(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  private getMockOffers(): Observable<Offer[]> {
    const mockOffers: Offer[] = [
      {
        id: 1,
        title: 'خصم 20% على الفيتامينات',
        description: 'احصل على خصم 20% على جميع أنواع الفيتامينات والمكملات الغذائية',
        discountPercentage: 20,
        validFrom: '2025-01-01',
        validTo: '2025-01-31',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
        isActive: true,
        applicableMedicines: [3, 6]
      },
      {
        id: 2,
        title: 'عرض خاص على مستحضرات التجميل',
        description: 'خصم 15% على جميع مستحضرات العناية بالبشرة والشعر',
        discountPercentage: 15,
        validFrom: '2025-01-10',
        validTo: '2025-02-10',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
        isActive: true,
        applicableMedicines: [7]
      }
    ];

    return of(mockOffers).pipe(delay(300));
  }
}