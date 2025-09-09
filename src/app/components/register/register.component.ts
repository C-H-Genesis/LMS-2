import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../DTOs/RegisterRequest';
import { AuthService } from '../../auth/auth.service';
import { Console } from 'node:console';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';



@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  successMessage: string = ''; 
  errorMessage: string = '';
  faculties: any[] = [];
  showFacultySelect = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      role: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      facultyName: ['']
    });
  }

  ngOnInit(): void {
    this.loadFaculties();

    this.registerForm.get('role')?.valueChanges.subscribe(role => {
    this.showFacultySelect = role === 'Student';

    // Clear faculty selection if role is not Student
    if (!this.showFacultySelect) {
      this.registerForm.get('facultyId')?.reset();
    }
  });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerData: RegisterRequest = this.registerForm.value;
      this.authService.register(registerData).subscribe(
        () => {
          this.router.navigate(['/login']);
          this.toastr.success("Registration Successfull, Check Your email for your Password then Login");
        },
        () => {
         console.error(this.errorMessage = 'Registration failed. Please try again.');
         this.toastr.error("Registration Unsuccessfull, Try Again");
        }
      );
    }
  }

  loadFaculties() {
  this.http.get<any[]>(`${environment.apiUrl}/api/auth/GetAllFaculties`).subscribe({
    next: (data) => this.faculties = data,
    error: (err) => console.error('Error fetching faculties', err)
  });
}
}
