import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  email = '';
  token = '';
  newPassword = '';
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.email = decodeURIComponent(this.route.snapshot.queryParamMap.get('email') || '');
    this.token = decodeURIComponent(this.route.snapshot.queryParamMap.get('token') || '');
  }

  onSubmit() {
    const data = {
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(data).subscribe({
      next: () => {
        this.message = 'Password has been reset.';
      this.messageType = 'success';
     this.toastr.success(this.message);
      this.router.navigate(['/login']);

  },
  error: (error) => {
    this.message = error.error || 'Invalid or expired token.';
    this.messageType = 'error';
    this.toastr.error("Invalid or expired token,Try Again");
    
      }
    });
  }

}
