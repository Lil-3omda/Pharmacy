import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export enum OrderStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface OrderItem {
  id: number;
  orderId: number;
  medicineId: number;
  medicine: {
    id: number;
    nameAr: string;
    nameEn: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
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
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`);
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/by-status/${status}`);
  }

  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateOrderStatus(id: number, statusUpdate: UpdateOrderStatusRequest): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, statusUpdate);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  approveOrder(id: number, notes?: string): Observable<Order> {
    return this.updateOrderStatus(id, { status: OrderStatus.Approved, notes });
  }

  rejectOrder(id: number, notes?: string): Observable<Order> {
    return this.updateOrderStatus(id, { status: OrderStatus.Rejected, notes });
  }

  completeOrder(id: number, notes?: string): Observable<Order> {
    return this.updateOrderStatus(id, { status: OrderStatus.Completed, notes });
  }

  cancelOrder(id: number, notes?: string): Observable<Order> {
    return this.updateOrderStatus(id, { status: OrderStatus.Cancelled, notes });
  }
}