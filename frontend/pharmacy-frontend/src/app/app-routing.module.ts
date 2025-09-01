import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Components
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MedicineListComponent } from './pages/medicine-list/medicine-list.component';
import { MedicineDetailComponent } from './pages/medicine-detail/medicine-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PharmacistDashboardComponent } from './pages/pharmacist-dashboard/pharmacist-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'medicines', pathMatch: 'full' },
      { path: 'medicines', component: MedicineListComponent },
      { path: 'medicine/:id', component: MedicineDetailComponent },
      { path: 'cart', component: CartComponent },
      { path: 'orders', component: OrderHistoryComponent }
    ]
  },
  
  // Admin routes
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  
  // Pharmacist routes
  {
    path: 'pharmacist',
    component: PharmacistDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Pharmacist', 'Admin'] }
  },
  
  // Wildcard route
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }