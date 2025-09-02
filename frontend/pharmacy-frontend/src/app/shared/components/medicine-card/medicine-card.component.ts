import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Medicine } from '../../../core/models';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-medicine-card',
  templateUrl: './medicine-card.component.html',
  styleUrls: ['./medicine-card.component.scss']
})
export class MedicineCardComponent {
  @Input() medicine!: Medicine;
  @Input() showActions = true;
  @Input() discountPercentage = 0;
  @Output() addToCart = new EventEmitter<Medicine>();
  @Output() favoriteToggled = new EventEmitter<Medicine>();

  isFavorite = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  get hasDiscount(): boolean {
    return this.discountPercentage > 0;
  }

  getCurrentPrice(): number {
    if (this.hasDiscount) {
      return this.medicine.price * (1 - this.discountPercentage / 100);
    }
    return this.medicine.price;
  }

  onAddToCart() {
    if (!this.authService.getCurrentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.medicine.prescriptionRequired) {
      this.notificationService.showWarning('هذا الدواء يتطلب وصفة طبية');
      return;
    }
    
    this.cartService.addToCart(this.medicine, 1);
    this.notificationService.showSuccess(`تم إضافة ${this.medicine.nameAr} إلى السلة`);
    this.addToCart.emit(this.medicine);
  }

  viewDetails() {
    this.router.navigate(['/products', this.medicine.id]);
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.favoriteToggled.emit(this.medicine);
    
    const message = this.isFavorite 
      ? `تم إضافة ${this.medicine.nameAr} إلى المفضلة`
      : `تم إزالة ${this.medicine.nameAr} من المفضلة`;
    
    this.notificationService.showInfo(message);
  }

  isOutOfStock(): boolean {
    return this.medicine.stock <= 0;
  }

  isLowStock(): boolean {
    return this.medicine.stock > 0 && this.medicine.stock <= 10;
  }
}