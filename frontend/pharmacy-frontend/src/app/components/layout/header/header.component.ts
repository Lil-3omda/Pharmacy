import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { User, UserRole } from '../../../models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  cartItemsCount$: Observable<number>;
  
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.cartItemsCount$ = this.cartService.getCartItemsCount();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToDashboard(): void {
    const user = this.authService.currentUserValue;
    if (!user) return;

    switch (user.role) {
      case UserRole.ADMIN:
        this.router.navigate(['/dashboard/overview']);
        break;
      case UserRole.PHARMACIST:
        this.router.navigate(['/dashboard/pharmacist']);
        break;
      case UserRole.CUSTOMER:
        this.router.navigate(['/dashboard/customer']);
        break;
    }
  }

  get userRole() {
    return UserRole;
  }
}