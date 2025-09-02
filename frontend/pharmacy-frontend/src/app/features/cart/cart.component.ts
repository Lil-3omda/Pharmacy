import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(medicineId: number, quantity: number) {
    this.cartService.updateQuantity(medicineId, quantity);
  }

  removeItem(medicineId: number) {
    this.cartService.removeFromCart(medicineId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTax(): number {
    return this.getSubtotal() * 0.15; // 15% VAT
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  proceedToCheckout() {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  increaseQuantity(item: CartItem) {
    if (item.quantity < item.medicine.stock) {
      this.updateQuantity(item.medicine.id, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.updateQuantity(item.medicine.id, item.quantity - 1);
    }
  }
}