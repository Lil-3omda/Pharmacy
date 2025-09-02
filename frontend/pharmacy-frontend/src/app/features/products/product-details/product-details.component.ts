import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService, Medicine } from '../../../core/services/medicine.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  medicine: Medicine | null = null;
  relatedMedicines: Medicine[] = [];
  isLoading = true;
  quantity = 1;
  selectedImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicineService: MedicineService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadMedicine(id);
    });
  }

  loadMedicine(id: number) {
    this.isLoading = true;
    
    this.medicineService.getMedicine(id).subscribe({
      next: (medicine) => {
        this.medicine = medicine;
        this.loadRelatedMedicines();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  loadRelatedMedicines() {
    if (this.medicine) {
      this.medicineService.getMedicines({ categoryId: this.medicine.categoryId }).subscribe({
        next: (medicines) => {
          this.relatedMedicines = medicines
            .filter(m => m.id !== this.medicine!.id)
            .slice(0, 4);
        }
      });
    }
  }

  addToCart() {
    if (!this.authService.getCurrentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.medicine) {
      this.cartService.addToCart(this.medicine, this.quantity);
    }
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  increaseQuantity() {
    if (this.medicine && this.quantity < this.medicine.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  isOutOfStock(): boolean {
    return this.medicine ? this.medicine.stock <= 0 : false;
  }

  isLowStock(): boolean {
    return this.medicine ? this.medicine.stock > 0 && this.medicine.stock <= 10 : false;
  }

  onRelatedProductClick(medicine: Medicine) {
    this.router.navigate(['/products', medicine.id]);
  }
}