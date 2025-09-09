import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  fileId?: string;
  fileUrl?: string;
  fileName?: string;
  writtenAssignment?: string;
  grade: number;
  gradeText: string;
  feedback: string;

  file?: {
    fileName?: string;
    contentType: string;
    content: string; // base64 string
  };
}

@Component({
  selector: 'app-student-assignment',
  templateUrl: './student-assignment.component.html',
  styleUrls: ['./student-assignment.component.css'],
  standalone: false,
})
export class StudentAssignmentComponent implements OnInit {
  assignments: Assignment[] = [];
  loadingAssignments = false;
  errorMessage = '';
  submitError = '';
  submitSuccess = '';

  selectedAssignment: Assignment | null = null;
  showModal = false;
  showForm = false;
  isFileUpload = false;
  selectedFile: File | null = null;

  submissionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAssignments();
  }

  private initializeForm() {
    this.submissionForm = this.fb.group({
      assignmentId: ['', Validators.required],
      courseId: ['', Validators.required],
      course: [{ value: '', disabled: true }, Validators.required],
      userId: ['', Validators.required],
      writtenSubmission: [''],
      submittedAt: [new Date().toISOString().substring(0, 16), Validators.required],
      fileId: [''],          // ← new control for FileId
      fileUrl: [''],         // ← keep for backup if needed
    });
  }

  loadAssignments() {
    this.loadingAssignments = true;
    this.errorMessage = '';
    this.studentService.getAssignmentsByCourse().subscribe({
      next: (data: Assignment[]) => {
        this.assignments = data;
        this.loadingAssignments = false;
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to load assignments.';
        console.error('Error loading assignments:', this.errorMessage);
        this.loadingAssignments = false;
      },
    });
  }

  selectAssignment(assignment: Assignment) {
    this.selectedAssignment = assignment;
    this.showModal = true;
    this.showForm = false;
    this.isFileUpload = false;
    this.selectedFile = null;
    this.submitError = '';
    this.submitSuccess = '';

    this.submissionForm.patchValue({
      assignmentId: assignment.id,
      courseId: assignment.courseId,
      course: assignment.courseName,
      userId: this.getUserIdFromToken(),
      writtenSubmission: '',
      submittedAt: new Date().toISOString().substring(0, 16),
      fileId: '',     // clear any previous FileId
      fileUrl: '',    // clear any previous FileUrl
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedAssignment = null;
    this.cancelSubmission();
  }

  beginSubmission() {
    this.showForm = true;
  }

  cancelSubmission() {
    this.showForm = false;
    this.isFileUpload = false;
    this.selectedFile = null;
    this.submitError = '';
    this.submitSuccess = '';
    // Reset only the submission fields, keep assignment/course/user IDs
    this.submissionForm.patchValue({
      writtenSubmission: '',
      fileId: '',
      fileUrl: '',
    });
  }

  toggleUploadMode() {
    this.isFileUpload = !this.isFileUpload;
    if (this.isFileUpload) {
      this.submissionForm.get('writtenSubmission')?.setValue('');
    } else {
      this.selectedFile = null;
      this.submissionForm.get('fileId')?.setValue('');
      this.submissionForm.get('fileUrl')?.setValue('');
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  resetForm(): void {
  this.submissionForm.reset();
  this.selectedAssignment = null;
  this.selectedFile = null;
  this.isFileUpload = false;
}

   submitAssignment() {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      this.toastr.error('User ID not found. Please log in again.');
      return;
    }
    this.submitError = '';
    this.submitSuccess = '';

    if (!this.selectedAssignment) {
      this.submitError = 'No assignment selected.';
      this.toastr.error(this.submitError);
      return;
    }

    const formValue = this.submissionForm.getRawValue();
    // Build our payload object
    const payload = {
      assignmentId: formValue.assignmentId,
      courseId: formValue.courseId,
      userId: userId, // or however you retrieve the logged‐in user’s ID
      writtenSubmission: (this.isFileUpload ? '' : formValue.writtenSubmission || ''),
      submittedAt: formValue.submittedAt
    };

    // If file‐upload mode is selected, ensure a file is chosen:
    if (this.isFileUpload && !this.selectedFile) {
      this.submitError = 'Please select a file to upload.';
      this.toastr.error(this.submitError);
      return;
    }

    // Finally, call the new combined service method:
    this.studentService
      .postSubmission(payload, this.isFileUpload ? this.selectedFile : null)
      .subscribe({
        next: () => {
          this.submitSuccess = 'Assignment submitted successfully!';
          this.toastr.success(this.submitSuccess);
          this.resetForm();
        },
        error: (err) => {
          this.submitError = err.error || 'Submission failed.';
          this.toastr.error(this.submitError);
          console.error('Submission error:', err);
        }
      });
  }

  private getUserIdFromToken (): string {
  const token = this.authService.getToken();
  if (!token) {
    return '';
  }
  try {
    // 1) Split on “.”, base64‐decode the middle part, parse JSON
    const payloadBase64 = token.split('.')[1];
    const payloadJson   = atob(payloadBase64);
    const payload       = JSON.parse(payloadJson);

    // 2) Return the “UserId” claim (exact key depends on how your backend named it)
    return payload['UserId'] ?? '';
  } catch (e) {
    console.error('Failed to decode JWT and extract UserId:', e);
    return '';
  }
}

  downloadAssignmentFile(
    fileName: string | null,
    contentType: string | null,
    base64Content: string | null,
    fileId: string | null
  ) {
    if (base64Content && contentType && fileName) {
      // Convert Base64 → Blob → trigger download
      const byteChars = atob(base64Content);
      const byteNumbers = new Array(byteChars.length).fill(0).map((_, i) => byteChars.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    }
    else if (fileId && fileName) {
      // Fallback: fetch raw Blob from server
      this.studentService.downloadUploadedFile(fileId).subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = fileName;
          anchor.click();
          URL.revokeObjectURL(url);
        },
        error: err => {
          console.error('File download error:', err);
          this.toastr.error("Could not download the attached file");
        }
      });
    }
  }

  // Preview using Base64 if present; otherwise fetch via fileId
  previewAssignmentFile(
    contentType: string | null,
    base64Content: string | null,
    fileId: string | null
  ) {
    if (base64Content && contentType) {
      const byteChars = atob(base64Content);
      const byteNumbers = new Array(byteChars.length).fill(0).map((_, i) => byteChars.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
    else if (fileId) {
      this.studentService.downloadUploadedFile(fileId).subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: () => {
          this.toastr.error("Cannot preview file")
        }
      });
    }
  }

    isPdfOrImage(mime: string | null): boolean {
    return (
    mime === 'application/pdf'
    || (mime?.startsWith('image/') ?? false)
  );
  }

  isOfficeDoc(mime: string | null): boolean {
    return (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    || mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  );
  }


}

  
  

 
