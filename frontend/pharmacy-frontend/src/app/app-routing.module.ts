import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

// Components
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailsComponent } from './features/products/product-details/product-details.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrdersComponent } from './features/orders/orders.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './features/admin/manage-products/manage-products.component';
import { ManageOrdersComponent } from './features/admin/manage-orders/manage-orders.component';
import { ManageCategoriesComponent } from './features/admin/manage-categories/manage-categories.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { 
    path: 'cart', 
    component: CartComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'checkout', 
    component: CheckoutComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'orders', 
    component: OrdersComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Pharmacist'] }
  },
  {
    path: 'admin/products',
    component: ManageProductsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Pharmacist'] }
  },
  {
    path: 'admin/orders',
    component: ManageOrdersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Pharmacist'] }
  },
  {
    path: 'admin/categories',
    component: ManageCategoriesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Pharmacist'] }
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }