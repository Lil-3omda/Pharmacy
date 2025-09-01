import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'الصيدلية الإلكترونية';
  showHeader = true;
  showFooter = true;

  // Routes where header/footer should be hidden
  private readonly hiddenHeaderRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  private readonly hiddenFooterRoutes = ['/dashboard'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to route changes to show/hide header and footer
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateLayoutVisibility(event.url);
      });

    // Set initial visibility
    this.updateLayoutVisibility(this.router.url);
  }

  private updateLayoutVisibility(url: string): void {
    this.showHeader = !this.hiddenHeaderRoutes.some(route => url.startsWith(route));
    this.showFooter = !this.hiddenFooterRoutes.some(route => url.startsWith(route));
  }
}