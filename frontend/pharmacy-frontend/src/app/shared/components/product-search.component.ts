import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  @Output() searchChanged = new EventEmitter<any>();
  
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  priceRangeControl = new FormControl('');
  
  categories: any[] = [];
  priceRanges = [
    { value: '', label: 'جميع الأسعار' },
    { value: '0-50', label: '0 - 50 ر.س' },
    { value: '50-100', label: '50 - 100 ر.س' },
    { value: '100-200', label: '100 - 200 ر.س' },
    { value: '200+', label: '200+ ر.س' }
  ];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.setupSearchSubscriptions();
  }

  async loadCategories(): Promise<void> {
    try {
      this.categories = await this.categoryService.getCategories().toPromise();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  setupSearchSubscriptions(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.emitSearchParams());

    this.categoryControl.valueChanges.subscribe(() => this.emitSearchParams());
    this.priceRangeControl.valueChanges.subscribe(() => this.emitSearchParams());
  }

  emitSearchParams(): void {
    const searchParams = {
      search: this.searchControl.value || '',
      categoryId: this.categoryControl.value || null,
      priceRange: this.priceRangeControl.value || ''
    };
    
    this.searchChanged.emit(searchParams);
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
    this.priceRangeControl.setValue('');
  }
}