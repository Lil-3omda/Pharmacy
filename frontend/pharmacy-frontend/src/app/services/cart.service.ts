import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Medicine } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'pharmacy_cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const cartData = localStorage.getItem(this.CART_KEY);
    if (cartData) {
      try {
        const items = JSON.parse(cartData);
        this.cartItemsSubject.next(items);
      } catch (error) {
        console.error('خطأ في تحميل السلة:', error);
        this.clearCart();
      }
    }
  }

  private saveCartToStorage(): void {
    const items = this.cartItemsSubject.value;
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
  }

  public addToCart(medicine: Medicine, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(item => item.medicineId === medicine.id);

    if (existingItemIndex >= 0) {
      // Update existing item
      currentItems[existingItemIndex].quantity += quantity;
      currentItems[existingItemIndex].totalPrice = 
        currentItems[existingItemIndex].quantity * currentItems[existingItemIndex].unitPrice;
    } else {
      // Add new item
      const newItem: CartItem = {
        medicineId: medicine.id,
        medicine: medicine,
        quantity: quantity,
        unitPrice: medicine.price,
        totalPrice: medicine.price * quantity
      };
      currentItems.push(newItem);
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCartToStorage();
  }

  public removeFromCart(medicineId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.medicineId !== medicineId);
    
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  public updateQuantity(medicineId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(medicineId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(item => item.medicineId === medicineId);

    if (itemIndex >= 0) {
      currentItems[itemIndex].quantity = quantity;
      currentItems[itemIndex].totalPrice = quantity * currentItems[itemIndex].unitPrice;
      
      this.cartItemsSubject.next([...currentItems]);
      this.saveCartToStorage();
    }
  }

  public clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem(this.CART_KEY);
  }

  public getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  public getCartItemsValue(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  public getCartItemsCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  public getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.totalPrice, 0))
    );
  }

  public isInCart(medicineId: string): Observable<boolean> {
    return this.cartItems$.pipe(
      map(items => items.some(item => item.medicineId === medicineId))
    );
  }

  public getCartItemQuantity(medicineId: string): Observable<number> {
    return this.cartItems$.pipe(
      map(items => {
        const item = items.find(item => item.medicineId === medicineId);
        return item ? item.quantity : 0;
      })
    );
  }
}