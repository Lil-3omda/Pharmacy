import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MedicineService, Medicine, MedicineFilter } from '../../../core/services/medicine.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  medicines: Medicine[] = [];
  categories: Category[] = [];
  isLoading = true;
  
  // Filters
  searchControl = new FormControl('');
  selectedCategory: number | null = null;
  priceRange = { min: 0, max: 1000 };
  showInStockOnly = false;
  showExpiringSoon = false;
  
  // Sorting
  sortBy = 'name';
  sortDirection = 'asc';
  
  // View mode
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private medicineService: MedicineService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.setupSearch();
    this.handleQueryParams();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  handleQueryParams() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchControl.setValue(params['search']);
      }
      if (params['category']) {
        this.selectedCategory = +params['category'];
      }
      this.applyFilters();
    });
  }

  applyFilters() {
    this.isLoading = true;
    
    const filter: MedicineFilter = {
      searchTerm: this.searchControl.value || undefined,
      categoryId: this.selectedCategory || undefined,
      minPrice: this.priceRange.min > 0 ? this.priceRange.min : undefined,
      maxPrice: this.priceRange.max < 1000 ? this.priceRange.max : undefined,
      inStock: this.showInStockOnly || undefined,
      expiringSoon: this.showExpiringSoon || undefined
    };

    this.medicineService.getMedicines(filter).subscribe({
      next: (medicines) => {
        this.medicines = this.sortMedicines(medicines);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  sortMedicines(medicines: Medicine[]): Medicine[] {
    return medicines.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'name':
          comparison = a.nameAr.localeCompare(b.nameAr);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        default:
          comparison = 0;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onCategoryChange(categoryId: number | null) {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  onSortChange(sortBy: string) {
    if (this.sortBy === sortBy) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortDirection = 'asc';
    }
    this.medicines = this.sortMedicines(this.medicines);
  }

  onAddToCart(medicine: Medicine) {
    this.cartService.addToCart(medicine, 1);
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.selectedCategory = null;
    this.priceRange = { min: 0, max: 1000 };
    this.showInStockOnly = false;
    this.showExpiringSoon = false;
    this.applyFilters();
  }
}