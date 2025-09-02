import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Medicine } from '../../../core/services/medicine.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() medicine!: Medicine;
  @Input() showActions = true;
  @Output() addToCart = new EventEmitter<Medicine>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  onAddToCart() {
    if (!this.authService.getCurrentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.cartService.addToCart(this.medicine, 1);
    this.addToCart.emit(this.medicine);
  }

  viewDetails() {
    this.router.navigate(['/products', this.medicine.id]);
  }

  isOutOfStock(): boolean {
    return this.medicine.stock <= 0;
  }

  isLowStock(): boolean {
    return this.medicine.stock > 0 && this.medicine.stock <= 10;
  }
}