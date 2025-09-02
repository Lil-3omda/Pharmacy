import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';

export interface Order {
  id: number;
  orderDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  totalPrice: number;
  itemCount: number;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  selectedStatus = 'all';

  statusOptions = [
    { value: 'all', label: 'جميع الطلبات' },
    { value: 'Pending', label: 'قيد الانتظار' },
    { value: 'Approved', label: 'مؤكد' },
    { value: 'Completed', label: 'مكتمل' },
    { value: 'Cancelled', label: 'ملغي' }
  ];

  constructor(private orderService: OrderService) {}

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
          orderDate: '2025-01-15T10:30:00',
          status: 'Completed',
          totalPrice: 125.50,
          itemCount: 3,
          items: [
            { id: 1, name: 'باراسيتامول', quantity: 2, price: 15.50, image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg' },
            { id: 2, name: 'فيتامين سي', quantity: 1, price: 35.00, image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg' }
          ]
        },
        {
          id: 2,
          orderDate: '2025-01-10T14:15:00',
          status: 'Pending',
          totalPrice: 89.25,
          itemCount: 2,
          items: [
            { id: 3, name: 'أموكسيسيلين', quantity: 1, price: 25.75, image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg' }
          ]
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  getFilteredOrders(): Order[] {
    if (this.selectedStatus === 'all') {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.selectedStatus);
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
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  reorderItems(order: Order) {
    // Add all items from this order to cart
    // Implementation would depend on your cart service
    console.log('Reordering items from order:', order.id);
  }

  cancelOrder(orderId: number) {
    // Implementation for canceling order
    console.log('Canceling order:', orderId);
  }

  canCancelOrder(order: Order): boolean {
    return order.status === 'Pending';
  }
}