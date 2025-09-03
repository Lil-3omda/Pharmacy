import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockAlerts: number;
}

export interface SalesChartData {
  date: string;
  sales: number;
  orderCount: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface LowStockAlert {
  productId: number;
  productName: string;
  currentStock: number;
  minimumLevel: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    if ((environment as any).useMockAuth) {
      return this.getMockDashboardStats();
    }
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard-stats`);
  }

  getSalesChartData(fromDate: Date, toDate: Date): Observable<SalesChartData[]> {
    if ((environment as any).useMockAuth) {
      return this.getMockSalesData();
    }
    return this.http.get<SalesChartData[]>(`${this.apiUrl}/sales-chart`, {
      params: {
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString()
      }
    });
  }

  getTopSellingProducts(): Observable<TopProduct[]> {
    if ((environment as any).useMockAuth) {
      return this.getMockTopProducts();
    }
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-products`);
  }

  getLowStockAlerts(): Observable<LowStockAlert[]> {
    if ((environment as any).useMockAuth) {
      return this.getMockLowStockAlerts();
    }
    return this.http.get<LowStockAlert[]>(`${this.apiUrl}/low-stock`);
  }

  private getMockDashboardStats(): Observable<DashboardStats> {
    const stats: DashboardStats = {
      totalProducts: 156,
      totalOrders: 89,
      totalRevenue: 15750,
      pendingOrders: 8,
      lowStockAlerts: 12
    };
    return of(stats).pipe(delay(300));
  }

  private getMockSalesData(): Observable<SalesChartData[]> {
    const data: SalesChartData[] = [
      { date: '2025-01-01', sales: 1200, orderCount: 15 },
      { date: '2025-01-02', sales: 1500, orderCount: 18 },
      { date: '2025-01-03', sales: 900, orderCount: 12 },
      { date: '2025-01-04', sales: 1800, orderCount: 22 },
      { date: '2025-01-05', sales: 2100, orderCount: 25 }
    ];
    return of(data).pipe(delay(500));
  }

  private getMockTopProducts(): Observable<TopProduct[]> {
    const products: TopProduct[] = [
      { productId: 1, productName: 'باراسيتامول', totalQuantitySold: 150, totalRevenue: 2325 },
      { productId: 2, productName: 'أموكسيسيلين', totalQuantitySold: 120, totalRevenue: 3090 },
      { productId: 3, productName: 'فيتامين سي', totalQuantitySold: 100, totalRevenue: 3500 }
    ];
    return of(products).pipe(delay(400));
  }

  private getMockLowStockAlerts(): Observable<LowStockAlert[]> {
    const alerts: LowStockAlert[] = [
      { productId: 1, productName: 'باراسيتامول', currentStock: 5, minimumLevel: 10, category: 'مسكنات' },
      { productId: 2, productName: 'أموكسيسيلين', currentStock: 3, minimumLevel: 10, category: 'مضادات حيوية' }
    ];
    return of(alerts).pipe(delay(400));
  }
}