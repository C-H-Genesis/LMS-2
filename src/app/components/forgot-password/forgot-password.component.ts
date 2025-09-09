import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email = '';
  message: string = '';

  constructor(private authService: AuthService, private router: Router,  private toastr: ToastrService) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.message = 'Reset link was sent to your email.';
       this.toastr.success(this.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.message = 'Failed to send reset link. Please try again.';
        this.toastr.error(this.message);
        console.error(err);
      }
    });
  }

}
