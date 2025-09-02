import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId: number | null = null;
  @Input() totalCount: number = 0;
  @Output() categorySelected = new EventEmitter<number | null>();

  selectCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    this.categorySelected.emit(categoryId);
  }

  getCategoryIcon(nameEn: string): string {
    const iconMap: { [key: string]: string } = {
      'Antibiotics': 'healing',
      'Painkillers': 'medication',
      'Pain Relievers': 'medication',
      'Vitamins': 'fitness_center',
      'Cosmetics': 'face',
      'Cardiovascular': 'favorite',
      'Pediatric': 'child_care',
      'Dermatology': 'spa',
      'Respiratory': 'air',
      'Digestive': 'restaurant'
    };
    
    return iconMap[nameEn] || 'category';
  }
}