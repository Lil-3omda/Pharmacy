import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MedicineService } from '../../../services/medicine.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { Medicine, Category, User } from '../../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredMedicines: Medicine[] = [];
  categories: Category[] = [];
  currentUser$: Observable<User | null>;
  loading = true;

  // Hero section data
  heroFeatures = [
    {
      icon: 'verified',
      title: 'أدوية أصلية ومضمونة',
      description: 'جميع أدويتنا من مصادر موثوقة ومرخصة'
    },
    {
      icon: 'delivery_dining',
      title: 'توصيل سريع',
      description: 'توصيل مجاني للطلبات أكثر من 100 ريال'
    },
    {
      icon: 'support_agent',
      title: 'استشارة صيدلانية',
      description: 'فريق من الصيادلة المؤهلين لخدمتك'
    },
    {
      icon: 'security',
      title: 'آمان وخصوصية',
      description: 'حماية كاملة لبياناتك الشخصية والطبية'
    }
  ];

  constructor(
    private medicineService: MedicineService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadHomeData();
  }

  private loadHomeData(): void {
    this.loading = true;

    // Load categories
    this.categoryService.getCategoriesWithCounts().subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 6); // Show first 6 categories
      },
      error: (error) => {
        console.error('خطأ في تحميل الفئات:', error);
      }
    });

    // Load featured medicines (latest 8)
    this.medicineService.getMedicines({
      page: 1,
      limit: 8,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    }).subscribe({
      next: (response) => {
        this.featuredMedicines = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في تحميل الأدوية المميزة:', error);
        this.loading = false;
      }
    });
  }

  navigateToMedicines(categoryId?: string): void {
    if (categoryId) {
      this.router.navigate(['/medicines'], { queryParams: { categoryId } });
    } else {
      this.router.navigate(['/medicines']);
    }
  }

  navigateToMedicineDetail(medicineId: string): void {
    this.router.navigate(['/medicine', medicineId]);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}