import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// App Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Core
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

// Services
import { AuthService } from './core/services/auth.service';
import { MedicineService } from './core/services/medicine.service';
import { OrderService } from './core/services/order.service';
import { CartService } from './core/services/cart.service';
import { CategoryService } from './core/services/category.service';
import { NotificationService } from './core/services/notification.service';
import { PrescriptionService } from './core/services/prescription.service';
import { OfferService } from './core/services/offer.service';
import { AnalyticsService } from './core/services/analytics.service';
import { ProductService } from './core/services/product.service';

// Shared Components
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component';
import { MedicineCardComponent } from './shared/components/medicine-card/medicine-card.component';
import { CategoryFilterComponent } from './shared/components/category-filter/category-filter.component';
import { AnalyticsDashboardComponent } from './shared/components/analytics-dashboard/analytics-dashboard.component';
import { BarcodeScannerComponent } from './shared/components/barcode-scanner/barcode-scanner.component';
import { PrescriptionUploadComponent } from './shared/components/prescription-upload.component';
import { ProductSearchComponent } from './shared/components/product-search.component';
import { VisitorHomeComponent } from './shared/components/visitor-home/visitor-home.component';

// Feature Components
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailsComponent } from './features/products/product-details/product-details.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrdersComponent } from './features/orders/orders.component';
import { ProfileComponent } from './features/profile/profile.component';
import { PrescriptionsComponent } from './features/prescriptions/prescriptions.component';
import { OffersComponent } from './features/offers/offers.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './features/admin/manage-products/manage-products.component';
import { ManageOrdersComponent } from './features/admin/manage-orders/manage-orders.component';
import { ManageCategoriesComponent } from './features/admin/manage-categories/manage-categories.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ProductCardComponent,
    MedicineCardComponent,
    SearchBarComponent,
    CategoryFilterComponent,
    LoadingSpinnerComponent,
    AnalyticsDashboardComponent,
    BarcodeScannerComponent,
    PrescriptionUploadComponent,
    ProductSearchComponent,
    VisitorHomeComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProductListComponent,
    ProductDetailsComponent,
    CartComponent,
    CheckoutComponent,
    OrdersComponent,
    ProfileComponent,
    PrescriptionsComponent,
    OffersComponent,
    FavoritesComponent,
    AdminDashboardComponent,
    ManageProductsComponent,
    ManageOrdersComponent,
    ManageCategoriesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,

    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatSelectModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    MatSliderModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    AuthService,
    MedicineService,
    ProductService,
    OrderService,
    CartService,
    CategoryService,
    NotificationService,
    PrescriptionService,
    OfferService,
    AnalyticsService,
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }