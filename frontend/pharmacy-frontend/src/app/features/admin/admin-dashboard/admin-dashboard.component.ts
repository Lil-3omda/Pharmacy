import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalProducts: 156,
    totalOrders: 89,
    totalUsers: 234,
    totalRevenue: 15750,
    lowStockProducts: 12,
    pendingOrders: 8,
    newUsers: 15,
    monthlyGrowth: 12.5
  };

  recentOrders = [
    { id: 1, customer: 'أحمد محمد', total: 125.50, status: 'Pending', date: '2025-01-15' },
    { id: 2, customer: 'فاطمة علي', total: 89.25, status: 'Completed', date: '2025-01-14' },
    { id: 3, customer: 'محمد سالم', total: 156.75, status: 'Approved', date: '2025-01-14' }
  ];

  recentPrescriptions = [
    { id: 1, doctorName: 'أحمد محمد', patient: 'سارة علي', date: '2025-01-15', status: 'Pending' },
    { id: 2, doctorName: 'فاطمة أحمد', patient: 'محمد سالم', date: '2025-01-14', status: 'Pending' }
  ];

  pendingPrescriptions = 2;
  lowStockProducts = [
    { name: 'باراسيتامول', stock: 5, category: 'مسكنات' },
    { name: 'أموكسيسيلين', stock: 3, category: 'مضادات حيوية' },
    { name: 'فيتامين د', stock: 8, category: 'فيتامينات' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToProducts() {
    this.router.navigate(['/admin/products']);
  }

  navigateToOrders() {
    this.router.navigate(['/admin/orders']);
  }

  navigateToCategories() {
    this.router.navigate(['/admin/categories']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Approved': return 'status-approved';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  }
}