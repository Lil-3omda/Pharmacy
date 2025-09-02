import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicineService, Medicine } from '../../core/services/medicine.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredMedicines: Medicine[] = [];
  categories: Category[] = [];
  isLoading = true;
  searchTerm = '';

  constructor(
    private medicineService: MedicineService,
    private categoryService: CategoryService,
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
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchTerm.trim() } 
      });
    }
  }

  onCategoryClick(categoryId: number) {
    this.router.navigate(['/products'], { 
      queryParams: { category: categoryId } 
    });
  }

  onAddToCart(medicine: Medicine) {
    this.cartService.addToCart(medicine, 1);
  }
}