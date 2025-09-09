import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';
import { switchMap, of, map, catchError, finalize } from 'rxjs';
@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
   profile: any = null;
  editMode = false;
  passwordModel = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  showPasswordForm = false;
  loading = true; 
  avatarUrl = '';        // ← holds full‐URL to the picture, if any
  initials = '';         // ← holds “AB” style initials fallback
  uploadInProgress = false;

  constructor (private adminService : AdminService, private toastr: ToastrService) {}


  ngOnInit(): void {
    this.fetchProfile();
    this.fetchProfilePicture();
  }

 fetchProfile(): void {
  this.loading = true;

  this.adminService.GetProfile().pipe(
    finalize(() => (this.loading = false))
  ).subscribe({
    next: (profile) => {
      this.profile = profile;

      // Try loading the picture if URL is provided
      if (profile.pictureUrl) {
        this.fetchProfilePicture();
      } else {
        this.initials = this.getInitials(profile.fullName);
      }
    },
    error: (err) => {
      console.error('Error fetching profile:', err);
      this.toastr.error('Error fetching profile');
    }
  });
}

fetchProfilePicture(): void {
  this.adminService.getProfilePicture().pipe(
    map(blob => URL.createObjectURL(blob)),
    catchError(err => {
      console.error('Error loading picture blob:', err);
      return of(null);
    })
  ).subscribe({
    next: (blobUrl) => {
      if (blobUrl) {
        this.avatarUrl = blobUrl;
      } else if (this.profile) {
        this.initials = this.getInitials(this.profile.fullName);
      }
    }
  });
}

  
    private getInitials(name: string): string {
      if (!name) return '';
      const parts = name.trim().split(/\s+/);
      const first = parts[0]?.[0] ?? '';
      const second = parts[1]?.[0] ?? '';
      return (first + second).toUpperCase();
    }  

    onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.uploadInProgress = true;

    this.adminService.uploadProfilePicture(file).pipe(
      switchMap(() =>
        this.adminService.getProfilePicture().pipe(
          map(blob => URL.createObjectURL(blob))
        )
      ),
      finalize(() => {
        this.uploadInProgress = false;
        input.value = ''; // reset file input
      }),
      catchError(err => {
        console.error('Upload failed', err);
        this.toastr.error('Failed to upload picture');
        return of(null);
      })
    ).subscribe(blobUrl => {
      if (blobUrl) {
        if (this.avatarUrl) URL.revokeObjectURL(this.avatarUrl);
        this.avatarUrl = blobUrl;
        this.toastr.success('Profile picture updated!');
      }
    });
  }
  

  updateProfile(): void {
    if (this.profile) {
      this.adminService.UpdateProfile(this.profile).subscribe(
        (updatedProfile) => {
          console.log('Profile updated:', updatedProfile);
          this.profile = updatedProfile; // Update the local profile object
         this.toastr.success("Profile Updated");
          this.editMode = false;
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.toastr.error("Error Updating profile,Try again");
          
        }
      );
    }
  }

   toggleChangePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
  }

  changePassword() {
  const { currentPassword, newPassword, confirmPassword } = this.passwordModel;

  if (!currentPassword || !newPassword || !confirmPassword) {
    this.toastr.warning('All fields are required.');
    return;
  }

  if (newPassword !== confirmPassword) {
    this.toastr.error('New passwords do not match.');
    return;
  }

  this.adminService.changePassword(this.passwordModel).subscribe({
    next: (res) => {
      this.toastr.success('Password changed successfully!');
      
      // ✅ Reset the form model
      this.passwordModel = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };

      // Optionally: Close the form or collapse the section
      this.toggleChangePasswordForm();
    },
    error: (err) => {
      this.toastr.error(err.error || 'Failed to change password.');
    }
  });
}

}
