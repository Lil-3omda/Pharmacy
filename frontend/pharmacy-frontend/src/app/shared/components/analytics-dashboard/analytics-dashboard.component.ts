import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { AnalyticsService, DashboardStats, SalesChartData, TopProduct, LowStockAlert } from '../../../core/services/analytics.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsDashboardComponent implements OnInit {

  dashboardStats: DashboardStats | null = null;
  salesChart: Chart | undefined;
  topProducts: TopProduct[] = [];
  lowStockAlerts: LowStockAlert[] = [];

  salesChartConfig: ChartConfiguration = {
    type: 'line' as ChartType,
    data: {
      labels: [],
      datasets: [{
        label: 'المبيعات اليومية',
        data: [],
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          rtl: true,
          textDirection: 'rtl'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' ر.س';
            }
          }
        }
      }
    }
  };

  constructor(private analyticsService: AnalyticsService) {}

  async ngOnInit(): Promise<void> {
    await this.loadDashboardStats();
    await this.loadSalesChart();
    await this.loadTopProducts();
    await this.loadLowStockAlerts();
  }

  async loadDashboardStats(): Promise<void> {
    try {
      this.dashboardStats = await firstValueFrom(this.analyticsService.getDashboardStats());
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }

  async loadSalesChart(): Promise<void> {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      const toDate = new Date();

      const salesData: SalesChartData[] = await firstValueFrom(
        this.analyticsService.getSalesChartData(fromDate, toDate)
      );

      this.salesChartConfig.data.labels = salesData.map(d => d.date);
      this.salesChartConfig.data.datasets[0].data = salesData.map(d => d.sales);

      if (this.salesChart) {
        this.salesChart.update();
      }
    } catch (error) {
      console.error('Error loading sales chart:', error);
    }
  }

  async loadTopProducts(): Promise<void> {
    try {
      this.topProducts = await firstValueFrom(this.analyticsService.getTopSellingProducts());
    } catch (error) {
      console.error('Error loading top products:', error);
    }
  }

  async loadLowStockAlerts(): Promise<void> {
    try {
      this.lowStockAlerts = await firstValueFrom(this.analyticsService.getLowStockAlerts());
    } catch (error) {
      console.error('Error loading low stock alerts:', error);
    }
  }
}
