import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SubmissionForTeacherDto } from '../../DTOs/TeacherSubmissionDto';
import { TeacherService } from '../../services/teacher.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeSubmissionDto } from '../../DTOs/GradeSubmissionDto';



@Component({
  selector: 'app-teacher-submission',
  standalone: false,
  templateUrl: './teacher-submission.component.html',
  styleUrl: './teacher-submission.component.css'
})
export class TeacherSubmissionComponent implements OnInit {
  submissions: SubmissionForTeacherDto[] = [];
  loading = true;
  gradingModalVisible = false;
  currentSubmission: SubmissionForTeacherDto | null = null;
  gradeForm!: FormGroup;

  constructor(
    private http: HttpClient, 
    private teacherService: TeacherService, 
    private toastr: ToastrService, 
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.gradeForm = this.fb.group({
    score: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
    feedback: ['', Validators.required],
  });
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.loading = true;

    this.teacherService.getAllSubmissions().subscribe({
      next: data => {
        this.submissions = data;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load submissions:', err);
        this.loading = false;
      }
    });
  }

  downloadSubmissionFile(fileName: string | null, contentType: string | null, fileId: string | null): void {
    if (fileId && fileName) {
      this.teacherService.downloadUploadedFile(fileId).subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = fileName;
          anchor.click();
          URL.revokeObjectURL(url);
        },
        error: err => {
          console.error('Download error:', err);
          this.toastr.success('Could not download file.');
        }
      });
    }
  }

  previewSubmissionFile(contentType: string | null, base64Content: string | null, fileId: string | null): void {
    if (base64Content && contentType) {
      const byteChars = atob(base64Content);
      const byteNumbers = Array.from(byteChars).map(c => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else if (fileId) {
      this.teacherService.downloadUploadedFile(fileId).subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: () => {
          this.toastr.error("Cannot preview this file but you can view it on your device because its dowloaded");
        }
      });
    }
  }

    openGradeModal(sub: SubmissionForTeacherDto) {
    this.currentSubmission = sub;
    this.gradeForm.patchValue({
      score: sub.score ?? null,
      feedback: sub.feedback ?? ''
    });
    this.gradingModalVisible = true;
  }

  closeGradeModal() {
    this.gradingModalVisible = false;
    this.currentSubmission = null;
    this.gradeForm.reset();
  }

   // teacher-submission.component.ts
  submitGrade() {
    if (!this.currentSubmission || this.gradeForm.invalid) return;

    const sub = this.currentSubmission;

    const dto: GradeSubmissionDto = {
      score:    this.gradeForm.value.score,
      feedback: this.gradeForm.value.feedback
    };

    // decide create vs update
    const call$ = sub.score != null
      ? this.teacherService.updateGrade(this.currentSubmission.submissionId, dto)
      : this.teacherService.gradeSubmission(this.currentSubmission.submissionId, dto);

    call$.subscribe({
      next: () => {
        this.toastr.success(
          sub.score != null
          ? 'Grade updated'
          : 'Grade saved'
        );
        this.loadSubmissions();
        this.closeGradeModal();
      },
      error: err => {
        console.error('Error saving grade', err);
        this.toastr.error('Failed to save grade');
      }
    });
  }



}
