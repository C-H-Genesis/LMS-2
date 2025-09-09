import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router } from '@angular/router';


declare global {
  interface Window { $: any; jQuery: any; WOW: any; }
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  loading = false;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      this.loading = true;
    } else if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this.loading = false;
    }
  });
}


 ngAfterViewInit() {

   if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // if you use WOW.js
    if (window.WOW) {
      new window.WOW().init();
    }

    // Owl Carousel is registered on jQuery.fn
    if (window.$ && typeof window.$.fn.owlCarousel === 'function') {
      window.$('.header-carousel').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        nav: false
      });
      window.$('.testimonial-carousel').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        nav: false
      });
    } else {
      console.error('Owl Carousel plugin not found');
    }
  }

  
}
