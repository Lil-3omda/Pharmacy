import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicineService, Medicine } from '../../../core/services/medicine.service';
import { CategoryService, Category } from '../../../core/services/category.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit {
  medicines: Medicine[] = [];
  categories: Category[] = [];
  isLoading = true;
  isEditMode = false;
  selectedMedicine: Medicine | null = null;
  
  productForm: FormGroup;
  displayedColumns = ['image', 'nameAr', 'category', 'price', 'stock', 'status', 'actions'];

  constructor(
    private medicineService: MedicineService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.formBuilder.group({
      nameAr: ['', [Validators.required]],
      nameEn: ['', [Validators.required]],
      descriptionAr: ['', [Validators.required]],
      descriptionEn: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      expiryDate: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    this.medicineService.getMedicines().subscribe({
      next: (medicines) => {
        this.medicines = medicines;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  openAddDialog() {
    this.isEditMode = false;
    this.selectedMedicine = null;
    this.productForm.reset();
  }

  openEditDialog(medicine: Medicine) {
    this.isEditMode = true;
    this.selectedMedicine = medicine;
    this.productForm.patchValue({
      nameAr: medicine.nameAr,
      nameEn: medicine.nameEn,
      descriptionAr: medicine.descriptionAr,
      descriptionEn: medicine.descriptionEn,
      categoryId: medicine.categoryId,
      price: medicine.price,
      stock: medicine.stock,
      expiryDate: medicine.expiryDate,
      imageUrl: medicine.imageUrl
    });
  }

  saveProduct() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      if (this.isEditMode && this.selectedMedicine) {
        // Update existing product
        this.medicineService.updateMedicine(this.selectedMedicine.id, productData).subscribe({
          next: () => {
            this.snackBar.open('تم تحديث المنتج بنجاح', 'إغلاق', { duration: 3000 });
            this.loadData();
            this.closeDialog();
          },
          error: () => {
            this.snackBar.open('حدث خطأ أثناء تحديث المنتج', 'إغلاق', { duration: 3000 });
          }
        });
      } else {
        // Create new product
        this.medicineService.createMedicine(productData).subscribe({
          next: () => {
            this.snackBar.open('تم إضافة المنتج بنجاح', 'إغلاق', { duration: 3000 });
            this.loadData();
            this.closeDialog();
          },
          error: () => {
            this.snackBar.open('حدث خطأ أثناء إضافة المنتج', 'إغلاق', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteProduct(medicine: Medicine) {
    if (confirm(`هل أنت متأكد من حذف ${medicine.nameAr}؟`)) {
      this.medicineService.deleteMedicine(medicine.id).subscribe({
        next: () => {
          this.snackBar.open('تم حذف المنتج بنجاح', 'إغلاق', { duration: 3000 });
          this.loadData();
        },
        error: () => {
          this.snackBar.open('حدث خطأ أثناء حذف المنتج', 'إغلاق', { duration: 3000 });
        }
      });
    }
  }

  closeDialog() {
    this.isEditMode = false;
    this.selectedMedicine = null;
    this.productForm.reset();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.nameAr : '';
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'نفد المخزون';
    if (stock <= 10) return 'مخزون قليل';
    return 'متوفر';
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return 'in-stock';
  }
}