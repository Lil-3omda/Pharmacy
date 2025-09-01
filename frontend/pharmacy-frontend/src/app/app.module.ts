import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material (only what Login uses)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// App Components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PharmacistDashboardComponent } from './pages/pharmacist-dashboard/pharmacist-dashboard.component';

// App Services
import { AuthService } from './services/auth.service';
import { MedicineService } from './services/medicine.service';
import { OrderService } from './services/order.service';
import { CartService } from './services/cart.service';
import { CategoryService } from './services/category.service';

// App Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// App Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

// App Routes
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdminDashboardComponent,
    PharmacistDashboardComponent
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
    MatSnackBarModule
  ],
  providers: [
    AuthService,
    MedicineService,
    OrderService,
    CartService,
    CategoryService,
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
