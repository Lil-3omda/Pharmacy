import { Component, OnInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface AdminOrder {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  totalPrice: number;
  itemCount: number;
  notes?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  orders: AdminOrder[] = [];
  isLoading = true;
  selectedStatus = 'all';
  displayedColumns = ['id', 'customer', 'date', 'items', 'total', 'status', 'actions'];

  statusOptions = [
    { value: 'all', label: 'جميع الطلبات' },
    { value: 'Pending', label: 'قيد الانتظار' },
    { value: 'Approved', label: 'مؤكد' },
    { value: 'Completed', label: 'مكتمل' },
    { value: 'Cancelled', label: 'ملغي' }
  ];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    
    // Mock orders data
    setTimeout(() => {
      this.orders = [
        {
          id: 1,
          customerName: 'أحمد محمد',
          customerEmail: 'ahmed@example.com',
          orderDate: '2025-01-15T10:30:00',
          status: 'Pending',
          totalPrice: 125.50,
          itemCount: 3,
          notes: 'توصيل سريع من فضلك',
          items: [
            { name: 'باراسيتامول', quantity: 2, price: 15.50 },
            { name: 'فيتامين سي', quantity: 1, price: 35.00 }
          ]
        },
        {
          id: 2,
          customerName: 'فاطمة علي',
          customerEmail: 'fatima@example.com',
          orderDate: '2025-01-14T14:15:00',
          status: 'Completed',
          totalPrice: 89.25,
          itemCount: 2,
          items: [
            { name: 'أموكسيسيلين', quantity: 1, price: 25.75 }
          ]
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  getFilteredOrders(): AdminOrder[] {
    if (this.selectedStatus === 'all') {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.selectedStatus);
  }

  approveOrder(order: AdminOrder) {
    order.status = 'Approved';
    this.snackBar.open(`تم قبول الطلب #${order.id}`, 'إغلاق', { duration: 3000 });
  }

  rejectOrder(order: AdminOrder) {
    order.status = 'Rejected';
    this.snackBar.open(`تم رفض الطلب #${order.id}`, 'إغلاق', { duration: 3000 });
  }

  completeOrder(order: AdminOrder) {
    order.status = 'Completed';
    this.snackBar.open(`تم إكمال الطلب #${order.id}`, 'إغلاق', { duration: 3000 });
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Approved': return 'status-approved';
      case 'Completed': return 'status-completed';
      case 'Rejected': return 'status-rejected';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  canApprove(order: AdminOrder): boolean {
    return order.status === 'Pending';
  }

  canReject(order: AdminOrder): boolean {
    return order.status === 'Pending';
  }

  canComplete(order: AdminOrder): boolean {
    return order.status === 'Approved';
  }
}