import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Medicine } from './medicine.service';

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(medicine: Medicine, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.medicine.id === medicine.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.medicine.price * existingItem.quantity;
    } else {
      const newItem: CartItem = {
        medicine,
        quantity,
        totalPrice: medicine.price * quantity
      };
      currentItems.push(newItem);
    }

    this.updateCart(currentItems);
  }

  removeFromCart(medicineId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.medicine.id !== medicineId);
    this.updateCart(updatedItems);
  }

  updateQuantity(medicineId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.medicine.id === medicineId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(medicineId);
      } else {
        item.quantity = quantity;
        item.totalPrice = item.medicine.price * quantity;
        this.updateCart(currentItems);
      }
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.totalPrice, 0);
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  isCartEmpty(): boolean {
    return this.cartItemsSubject.value.length === 0;
  }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }

  private loadCartFromStorage(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const items = JSON.parse(cartData);
        this.cartItemsSubject.next(items);
      } catch {
        this.clearCart();
      }
    }
  }
}