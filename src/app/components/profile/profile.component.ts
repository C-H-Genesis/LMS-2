import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap, of, map, catchError, finalize, Subscription } from 'rxjs';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    standalone: false
})

export class ProfileComponent implements OnInit {
  profile: any = null;
  avatarUrl = '';        // ← holds full‐URL to the picture, if any
  initials = '';         // ← holds “AB” style initials fallback
  loading = true;
  editMode = false;
  showPasswordForm = false;
  passwordModel = { currentPassword: '', newPassword: '', confirmPassword: '' };
  uploadInProgress = false;
  private subs = new Subscription();

  constructor(
    private studentService: StudentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  

  fetchProfile(): void {
    this.loading = true;
    this.studentService.getProfile().pipe(
      switchMap(profile => {
        this.profile = profile;

        // No picture URL? fall back immediately
        if (!profile.pictureUrl) {
          return of(null);
        }

        // Use your service to fetch the blob
        return this.studentService.getProfilePicture().pipe(
          // turn blob → object URL
          map(blob => URL.createObjectURL(blob)),
          catchError(err => {
            console.error('Error loading picture blob:', err);
            return of(null);
          })
        );
      }),
      finalize(() => (this.loading = false))
    ).subscribe({
      next: blobUrl => {
        if (blobUrl) {
          this.avatarUrl = blobUrl;
        } else {
          this.initials = this.getInitials(this.profile.fullName);
        }
      },
      error: err => {
        console.error('Error fetching profile:');
        this.toastr.error('Error fetching profile');
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

  updateProfile(): void {
    if (this.profile) {
      this.studentService.updateProfile(this.profile).subscribe(
        (updatedProfile) => {
          console.log('Profile updated:', updatedProfile);
          this.profile = updatedProfile; // Update the local profile object
         this.toastr.success("Profile Updated");
          this.editMode = false;
        },
        (error) => {
          console.error('Error updating profile:');
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

  this.studentService.changePassword(this.passwordModel).subscribe({
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


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.uploadInProgress = true;

    this.studentService.uploadProfilePicture(file).pipe(
      switchMap(() =>
        this.studentService.getProfilePicture().pipe(
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


  
}
