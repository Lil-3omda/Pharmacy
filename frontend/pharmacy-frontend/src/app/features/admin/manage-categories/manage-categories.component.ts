import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService, Category } from '../../../core/services/category.service';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss']
})
export class ManageCategoriesComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;
  isEditMode = false;
  selectedCategory: Category | null = null;
  
  categoryForm: FormGroup;
  displayedColumns = ['nameAr', 'nameEn', 'medicineCount', 'status', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.formBuilder.group({
      nameAr: ['', [Validators.required]],
      nameEn: ['', [Validators.required]],
      descriptionAr: [''],
      descriptionEn: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openAddDialog() {
    this.isEditMode = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
  }

  openEditDialog(category: Category) {
    this.isEditMode = true;
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      descriptionAr: category.descriptionAr,
      descriptionEn: category.descriptionEn
    });
  }

  saveCategory() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      
      if (this.isEditMode && this.selectedCategory) {
        // Update existing category
        this.categoryService.updateCategory(this.selectedCategory.id, categoryData).subscribe({
          next: () => {
            this.snackBar.open('تم تحديث الفئة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadCategories();
            this.closeDialog();
          },
          error: () => {
            this.snackBar.open('حدث خطأ أثناء تحديث الفئة', 'إغلاق', { duration: 3000 });
          }
        });
      } else {
        // Create new category
        this.categoryService.createCategory(categoryData).subscribe({
          next: () => {
            this.snackBar.open('تم إضافة الفئة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadCategories();
            this.closeDialog();
          },
          error: () => {
            this.snackBar.open('حدث خطأ أثناء إضافة الفئة', 'إغلاق', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteCategory(category: Category) {
    if (confirm(`هل أنت متأكد من حذف فئة "${category.nameAr}"؟`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.snackBar.open('تم حذف الفئة بنجاح', 'إغلاق', { duration: 3000 });
          this.loadCategories();
        },
        error: () => {
          this.snackBar.open('لا يمكن حذف فئة تحتوي على منتجات', 'إغلاق', { duration: 3000 });
        }
      });
    }
  }

  closeDialog() {
    this.isEditMode = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
  }
}