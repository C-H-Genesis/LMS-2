import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-teacher-profile',
  standalone: false,
  templateUrl: './teacher-profile.component.html',
  styleUrl: './teacher-profile.component.css'
})
export class TeacherProfileComponent {

   profile: any = null;
  editMode = false;
  passwordModel = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  showPasswordForm = false;
  loading = true; 

   constructor (private teacherService : TeacherService, private toastr: ToastrService) {}

   ngOnInit(): void {
    this.fetchProfile();
  }


   fetchProfile(): void {
    this.teacherService.getProfile().subscribe(
      (data) => {
        this.profile = data; // Assign fetched data to the profile object
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching profile:', error);
        this.loading = false;
        this.toastr.error("Error fetching profile");
       
      }
    );
  }
  

  updateProfile(): void {
    if (this.profile) {
      this.teacherService.updateProfile(this.profile).subscribe(
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

  this.teacherService.changePassword(this.passwordModel).subscribe({
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
