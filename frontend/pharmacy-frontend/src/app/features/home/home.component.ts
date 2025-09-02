import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicineService, Medicine } from '../../core/services/medicine.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { OfferService } from '../../core/services/offer.service';
import { CartService } from '../../core/services/cart.service';
import { Offer } from '../../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredMedicines: Medicine[] = [];
  categories: Category[] = [];
  currentOffer: Offer | null = null;
  isLoading = true;

  constructor(
    private medicineService: MedicineService,
    private categoryService: CategoryService,
    private offerService: OfferService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    // Load featured medicines
    this.medicineService.getMedicines().subscribe({
      next: (medicines) => {
        this.featuredMedicines = medicines.slice(0, 8);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    // Load categories
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });

    // Load current offer
    this.offerService.getActiveOffers().subscribe({
      next: (offers) => {
        this.currentOffer = offers.length > 0 ? offers[0] : null;
      }
    });
  }

  onSearch(searchTerm: string) {
    this.router.navigate(['/products'], { 
      queryParams: { search: searchTerm } 
    });
  }

  onSuggestionSelected(medicine: Medicine) {
    this.router.navigate(['/products', medicine.id]);
  }

  onCategoryClick(categoryId: number) {
    this.router.navigate(['/products'], { 
      queryParams: { category: categoryId } 
    });
  }

  viewOffer(offer: Offer) {
    this.router.navigate(['/offers']);
  }
  onAddToCart(medicine: Medicine) {
    this.cartService.addToCart(medicine, 1);
  }
}