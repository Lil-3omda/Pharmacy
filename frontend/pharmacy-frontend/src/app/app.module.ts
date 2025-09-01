import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';

// Charts
import { NgChartsModule } from 'ng2-charts';

// App Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Services
import { AuthService } from './services/auth.service';
import { MedicineService } from './services/medicine.service';
import { CategoryService } from './services/category.service';
import { OrderService } from './services/order.service';
import { DashboardService } from './services/dashboard.service';
import { NotificationService } from './services/notification.service';

// Components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';

import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { FooterComponent } from './components/layout/footer/footer.component';

import { HomeComponent } from './components/pages/home/home.component';
import { MedicinesComponent } from './components/pages/medicines/medicines.component';
import { MedicineDetailComponent } from './components/pages/medicine-detail/medicine-detail.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { ProfileComponent } from './components/pages/profile/profile.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { PharmacistDashboardComponent } from './components/dashboard/pharmacist-dashboard/pharmacist-dashboard.component';
import { CustomerDashboardComponent } from './components/dashboard/customer-dashboard/customer-dashboard.component';

import { ManageMedicinesComponent } from './components/admin/manage-medicines/manage-medicines.component';
import { ManageCategoriesComponent } from './components/admin/manage-categories/manage-categories.component';
import { ManageOrdersComponent } from './components/admin/manage-orders/manage-orders.component';
import { OrderDetailComponent } from './components/admin/order-detail/order-detail.component';

// Pipes
import { ArabicDatePipe } from './pipes/arabic-date.pipe';
import { ArabicNumberPipe } from './pipes/arabic-number.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyEmailComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    MedicinesComponent,
    MedicineDetailComponent,
    CartComponent,
    CheckoutComponent,
    ProfileComponent,
    DashboardComponent,
    AdminDashboardComponent,
    PharmacistDashboardComponent,
    CustomerDashboardComponent,
    ManageMedicinesComponent,
    ManageCategoriesComponent,
    ManageOrdersComponent,
    OrderDetailComponent,
    ArabicDatePipe,
    ArabicNumberPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    
    // Material Modules
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatExpansionModule,
    MatSliderModule,
    
    // Charts
    NgChartsModule
  ],
  providers: [
    AuthService,
    MedicineService,
    CategoryService,
    OrderService,
    DashboardService,
    NotificationService,
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }