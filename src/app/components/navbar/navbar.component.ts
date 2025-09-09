import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';  // Service to get role and token
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  isCollapsed = false;
   userName: string | null = null;
  userRole: string | null = null;
  currentUrl: string = '';
  userAvatarUrl: string | null = null; 
  userInitials : string | null = null;
  avatarMissing = false;
  menuOpen      = false;

  constructor(private authService: AuthService, private router: Router) {
       this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  ngOnInit(): void {
     const name = this.authService.getUserName();
    this.userName = name ?? '';
    this.userRole = this.authService.getRole() ?? '';
    this.getAvatar();

    // compute initials even if name is empty
    this.userInitials = this.computeInitials(this.userName);

    
  }

  getProfileLink(): string {
  switch (this.userRole) {
    case 'Teacher': return '/teacherProfile';
    case 'Admin':   return '/Adminprofile';
    default:        return '/profile';
  }
}

  toggleProfileMenu(evt: MouseEvent) {
    evt.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen = false;
  }


  logout(): void {
    this.authService.logout();  // Log out logic
  }

  getAvatar () {
       // 2) Load the avatar URL from the service (subscribe to the Observable)
    this.authService.getProfilePicture()
      .subscribe({
        next: (blob: Blob) => {
          // If the user has no picture, the API will 404 or return empty -- treat that as missing
          if (!blob || blob.size === 0) {
            this.avatarMissing = true;
            return;
          }
          // Create a temporary URL for the image blob
          this.userAvatarUrl = URL.createObjectURL(blob);
        },
        error: () => {
          // network error, 404, invalid mime type, etc.
          this.avatarMissing = true;
        }
      });
  }

  onAvatarError(): void {
    this.avatarMissing = true;
  }


  private computeInitials(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  }
}
