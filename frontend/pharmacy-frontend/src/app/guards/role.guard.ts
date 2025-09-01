import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as UserRole[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }

    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        if (requiredRoles.includes(user.role)) {
          return true;
        }

        // Redirect based on user role
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
          default:
            this.router.navigate(['/home']);
        }

        return false;
      })
    );
  }
}