import { Component, OnInit } from '@angular/core';
import { Medicine } from '../../core/models';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: Medicine[] = [];
  isLoading = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;
    
    // Mock favorites data
    setTimeout(() => {
      this.favorites = [
        {
          id: 1,
          nameAr: 'باراسيتامول',
          nameEn: 'Paracetamol',
          descriptionAr: 'مسكن للألم وخافض للحرارة',
          descriptionEn: 'Pain reliever and fever reducer',
          categoryId: 1,
          categoryNameAr: 'مسكنات الألم',
          price: 15.50,
          stock: 100,
          expiryDate: '2025-12-31',
          imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
          isActive: true,
          manufacturer: 'شركة الدواء',
          dosage: '500mg'
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  onAddToCart(medicine: Medicine) {
    this.notificationService.showSuccess(`تم إضافة ${medicine.nameAr} إلى السلة`);
  }

  onFavoriteToggled(medicine: Medicine) {
    this.favorites = this.favorites.filter(f => f.id !== medicine.id);
    this.notificationService.showInfo(`تم إزالة ${medicine.nameAr} من المفضلة`);
  }

  clearAllFavorites() {
    if (confirm('هل أنت متأكد من مسح جميع المنتجات المفضلة؟')) {
      this.favorites = [];
      this.notificationService.showInfo('تم مسح جميع المنتجات المفضلة');
    }
  }
}