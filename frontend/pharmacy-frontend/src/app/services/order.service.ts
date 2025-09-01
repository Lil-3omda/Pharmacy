import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Order, ApiResponse, CreateOrderRequest, OrderStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  public createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(this.baseUrl, orderData)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public getMyOrders(page: number = 1, limit: number = 10): Observable<ApiResponse<Order[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/my-orders`, { params });
  }

  public getOrderById(id: string): Observable<Order> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public getPendingOrders(): Observable<Order[]> {
    return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/pending`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data || [];
        })
      );
  }

  public getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/status/${status}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data || [];
        })
      );
  }

  public approveOrder(id: string): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(`${this.baseUrl}/${id}/approve`, {})
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public rejectOrder(id: string, rejectionReason: string): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(`${this.baseUrl}/${id}/reject`, { rejectionReason })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http.put<ApiResponse<Order>>(`${this.baseUrl}/${id}/status`, { status })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public cancelOrder(id: string): Observable<Order> {
    return this.http.delete<ApiResponse<Order>>(`${this.baseUrl}/${id}/cancel`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }
}