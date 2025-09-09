import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component , Inject, PLATFORM_ID} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Fixed styleUrl to styleUrls
  standalone: false
})
export class AppComponent implements AfterViewInit {
  title = 'SMS-LMS';
  showNavbar: boolean = true;
  loading = false;

  constructor(private router: Router , @Inject(PLATFORM_ID) private platformId: Object) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loading = false;
      }

      // Handle navbar visibility
      this.showNavbar = !['/login', '/register', '/home'].includes(this.router.url);
    });
  }

  ngAfterViewInit(): void {
    // Check if the platform is the browser before accessing document
    if (isPlatformBrowser(this.platformId)) {
      const spinner = document.getElementById('spinner');
      if (spinner) {
        spinner.classList.remove('show'); // Remove the 'show' class after loading is complete
      }
    }
  }
}
