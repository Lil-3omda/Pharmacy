import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export enum OrderStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface OrderItem {
  id: number;
  medicineId: number;
  medicineNameAr: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: string;
  userName: string;
  totalPrice: number;
  status: OrderStatus;
  notes?: string;
  orderDate: string;
  processedDate?: string;
  orderItems: OrderItem[];
}

export interface CreateOrderRequest {
  items: {
    medicineId: number;
    quantity: number;
  }[];
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    if ((environment as any).useMockAuth) {
      return this.getMockOrders();
    }
    
    return this.http.get<Order[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching orders:', error);
          return this.getMockOrders();
        })
      );
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user orders:', error);
          return this.getMockOrders();
        })
      );
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`);
  }

  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateOrderStatus(id: number, statusUpdate: UpdateOrderStatusRequest): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, statusUpdate);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  calculateTotal(items: { medicineId: number; quantity: number }[]): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/calculate-total`, items);
  }

  private getMockOrders(): Observable<Order[]> {
    const mockOrders: Order[] = [
      {
        id: 1,
        userId: 'user1',
        userName: 'أحمد محمد',
        totalPrice: 125.50,
        status: OrderStatus.Pending,
        notes: 'توصيل سريع من فضلك',
        orderDate: '2025-01-15T10:30:00',
        orderItems: [
          {
            id: 1,
            medicineId: 1,
            medicineNameAr: 'باراسيتامول',
            quantity: 2,
            unitPrice: 15.50,
            totalPrice: 31.00
          }
        ]
      }
    ];

    return of(mockOrders).pipe(delay(500));
  }
}