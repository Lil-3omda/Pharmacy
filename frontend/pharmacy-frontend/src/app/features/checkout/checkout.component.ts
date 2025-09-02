import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  isLoading = false;
  currentStep = 0;

  paymentMethods = [
    { value: 'cash', label: 'الدفع عند الاستلام', icon: 'payments' },
    { value: 'card', label: 'بطاقة ائتمان', icon: 'credit_card' },
    { value: 'bank', label: 'تحويل بنكي', icon: 'account_balance' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.checkoutForm = this.formBuilder.group({
      // Shipping Information
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      
      // Payment Information
      paymentMethod: ['cash', [Validators.required]],
      
      // Notes
      notes: ['']
    });
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTax(): number {
    return this.getSubtotal() * 0.15;
  }

  getShipping(): number {
    return 15; // Fixed shipping cost
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax() + this.getShipping();
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      this.isLoading = true;
      
      const orderData = {
        items: this.cartItems.map(item => ({
          medicineId: item.medicine.id,
          quantity: item.quantity
        })),
        notes: this.checkoutForm.value.notes || '',
        shippingInfo: {
          fullName: this.checkoutForm.value.fullName,
          phone: this.checkoutForm.value.phone,
          email: this.checkoutForm.value.email,
          address: this.checkoutForm.value.address,
          city: this.checkoutForm.value.city,
          postalCode: this.checkoutForm.value.postalCode
        },
        paymentMethod: this.checkoutForm.value.paymentMethod
      };

      // Simulate order creation
      setTimeout(() => {
        this.cartService.clearCart();
        this.isLoading = false;
        
        this.snackBar.open('تم إرسال طلبك بنجاح!', 'إغلاق', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        
        this.router.navigate(['/orders']);
      }, 2000);
    }
  }

  getStepLabel(step: number): string {
    switch (step) {
      case 0: return 'معلومات الشحن';
      case 1: return 'طريقة الدفع';
      case 2: return 'مراجعة الطلب';
      default: return '';
    }
  }
}