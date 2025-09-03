import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-visitor-home',
  templateUrl: './visitor-home.component.html',
  styleUrls: ['./visitor-home.component.scss']
})
export class VisitorHomeComponent implements OnInit {
  featuredProducts: any[] = [];
  categories: any[] = [];
  isRtl = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  async loadFeaturedProducts(): Promise<void> {
    try {
      const response = await this.productService.getProducts({ page: 1, pageSize: 8 }).toPromise();
      this.featuredProducts = response.products;
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  }

  async loadCategories(): Promise<void> {
    try {
      this.categories = await this.categoryService.getCategories().toPromise();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  navigateToProducts(categoryId?: number): void {
    this.router.navigate(['/products'], { queryParams: { categoryId } });
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}