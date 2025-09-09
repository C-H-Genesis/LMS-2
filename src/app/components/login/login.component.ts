import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../DTOs/LoginRequest';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = this.loginForm.value;
      this.authService.login(loginData).subscribe(
        (response: any) => {
          // Save the token
          this.authService.saveToken(response.token);
  
          // Get the role from the token
          const role = this.authService.getRole();
  
          // Navigate based on role
          switch (role) {
            case 'Admin':
              this.router.navigate(['/admin-dashboard']);
              break;
            case 'Teacher':
              this.router.navigate(['/teacher-dashboard']);
              break;
            case 'Student':
              this.router.navigate(['/student-dashboard']);
              break;
            case 'Finance':
              this.router.navigate(['/finance-dashboard']);
              break;
            default:
              this.router.navigate(['/login']);
             
          }
        },
        (error: any) => {
          console.error('Login error:', error);
          
          let errorMessage = 'An unexpected error occurred.';

          if (error.status === 401) {
            // Unauthorized error
            // Check if the error body contains the "message" property
            if (error.error && error.error.message) {
                errorMessage = error.error.message;
            } else {
                errorMessage = 'Invalid username or password.';
            }
          } else if (error.status === 400) {
              // Bad Request error (e.g., username/password are empty)
              errorMessage = error.error;
          }

          // Display the toast notification
          this.toastr.error(errorMessage, 'Login Failed');
          
        }
      );
    }
  }
  
}


