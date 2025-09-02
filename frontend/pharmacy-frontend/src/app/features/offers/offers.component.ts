import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';
import { Offer } from '../../core/models';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  offers: Offer[] = [];
  featuredOffer: Offer | null = null;
  isLoading = true;

  constructor(
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOffers();
  }

  loadOffers() {
    this.isLoading = true;
    
    this.offerService.getActiveOffers().subscribe({
      next: (offers) => {
        this.offers = offers;
        this.featuredOffer = offers.length > 0 ? offers[0] : null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  viewOfferProducts(offer: Offer) {
    this.router.navigate(['/products'], {
      queryParams: { offer: offer.id }
    });
  }

  getDaysRemaining(validTo: string): number {
    const today = new Date();
    const endDate = new Date(validTo);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}