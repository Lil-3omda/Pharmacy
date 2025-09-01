import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';

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

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'medicines', component: MedicinesComponent },
  { path: 'medicine/:id', component: MedicineDetailComponent },
  
  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },

  // Protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: AdminDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] }
      },
      {
        path: 'pharmacist',
        component: PharmacistDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Pharmacist'] }
      },
      {
        path: 'customer',
        component: CustomerDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Customer'] }
      }
    ]
  },

  // Customer routes
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Customer'] }
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Customer'] }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },

  // Admin/Pharmacist routes
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Pharmacist'] },
    children: [
      { path: '', redirectTo: 'medicines', pathMatch: 'full' },
      { path: 'medicines', component: ManageMedicinesComponent },
      { 
        path: 'categories', 
        component: ManageCategoriesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] }
      },
      { path: 'orders', component: ManageOrdersComponent },
      { path: 'order/:id', component: OrderDetailComponent }
    ]
  },

  // Fallback route
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }