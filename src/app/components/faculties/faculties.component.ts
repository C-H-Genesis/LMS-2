import { Component, OnInit } from '@angular/core';
import { AdminService, Faculty } from '../../services/admin.service';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare const bootstrap: any;


@Component({
  selector: 'app-faculties',
  standalone: false,
  templateUrl: './faculties.component.html',
  styleUrl: './faculties.component.css'
})
export class FacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  loading = false;
  error = '';
  showModal = false;
  form!: FormGroup;

  constructor(
    private facultyService: AdminService, 
    private fb: FormBuilder, 
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadFaculties();
    this.form = this.fb.group({
      facultyId: [0],
      facultyName: ['', Validators.required],
      facultyCode: ['', [Validators.required, Validators.maxLength(5)]],
    });
  }

  loadFaculties(): void {
    this.loading = true;
    this.error = '';
    this.facultyService.getFaculties()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: data => this.faculties = data,
        error: err => {
          console.error(err);
          this.error = 'Failed to load faculties.';
        }
      });
  }

  openAddFacultyModal() {
    this.showModal = false;
    this.form.reset();
    // show your modal, e.g. with Bootstrap
     const modalEl = document.getElementById('facultyModal')!;
    new bootstrap.Modal(modalEl).show();
  }

  openEditFacultyModal(f: Faculty) {
    this.showModal = true;
   this.form.setValue({
      facultyId: f.facultyId,
      facultyName: f.facultyName,
      facultyCode: f.facultyCode
    });
     const modalEl = document.getElementById('facultyModal')!;
    new bootstrap.Modal(modalEl).show();
  }

  createFaculty(): void {
    if (this.form.invalid) return;
    const dto = this.form.value;
    this.facultyService.addFaculty(dto).subscribe({
      next: () => {
        
        this.toastr.success('Faculty created');
        this.loadFaculties();
        this.closeModal();
      },
      error: err => this.toastr.error(err.error || 'Creation failed')
    });
  }

  /** Called when “Save Changes” button is clicked */
  updateFaculty(): void {
    if (this.form.invalid) return;
    const dto = this.form.value;
    this.facultyService.modifyFaculty(dto).subscribe({
      next: () => {
        this.toastr.success('Faculty updated');
        this.loadFaculties();
        this.closeModal();
      },
      error: err => this.toastr.error(err.error || 'Update failed')
    });
  }

  closeModal(): void {
  this.showModal = false;
  this.form.reset();

  // If you're using Bootstrap modal manually:
 const modalEl = document.getElementById('facultyModal')!;
    const modal   = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

 
}