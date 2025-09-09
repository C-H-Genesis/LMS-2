import { Component, OnDestroy } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-teacher-assignments',
  templateUrl: './teacher-assignments.component.html',
  styleUrl: './teacher-assignments.component.css',
  standalone: false
})
export class TeacherAssignmentsComponent implements OnDestroy {
  courses: any[] = [];
  selectedCourseId = '';
  title = '';
  description = '';
  WrittenAssignment = '';
  dueDate = '';
  selectedFile?: File;
  showModal = false;
  loadAssignments: any[] = [];
  selectedAssignment: any = null;
  assignmentAnswer = '';

  private subs = new Subscription();

  constructor(private assignmentService: TeacherService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadTeacherCourses();
    this.uploadedAssignments();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadTeacherCourses() {
    this.subs.add(
      this.assignmentService.loadCourses().subscribe({
        next: (data: any[]) => this.courses = data,
        error: err => {
          console.error("Error fetching courses:", err);
          this.toastr.error("No Courses Available");
        }
      })
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  openModal() {
    this.showModal = true;
  }

  submitAssignment() {
    if (!this.selectedCourseId) {
     this.toastr.warning('Please select a course');
    }

    // 1) If a file is selected, two-step: upload → create
    if (this.selectedFile) {
      this.subs.add(
        this.assignmentService.uploadFile(this.selectedFile).subscribe({
          next: (fileId: string) => {
            this.createAssignment({ fileId });
          },
          error: err => {
            console.error('Error uploading file:', err);
            this.toastr.error("Error uploading file, Try Again");
          }
        })
      );
    }
    // 2) Otherwise just create
    else {
      this.createAssignment();
    }
  }

  private createAssignment(opts: { fileId?: string } = {}) {
    const payload: any = {
      title: this.title,
      description: this.description,
      WrittenAssignment: this.WrittenAssignment,
      dueDate: new Date(this.dueDate).toISOString(),
      courseId: this.selectedCourseId,
      // only include fileId if we have one
      ...(opts.fileId ? { fileId: opts.fileId } : {})
    };

    this.subs.add(
      this.assignmentService.createAssignment(payload).subscribe({
        next: () => {
          this.toastr.success("Assignment posted successfully!");
          this.resetForm();
          this.closeModal();
          this.uploadedAssignments();
        },
        error: err => {
          console.error('Error creating assignment:', err);
          this.toastr.error("Error posting assignment")
        }
      })
    );
  }

  private resetForm() {
    this.title = '';
    this.description = '';
    this.WrittenAssignment = '';
    this.dueDate = '';
    this.selectedCourseId = '';
    this.selectedFile = undefined;
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  uploadedAssignments() {
    this.subs.add(
      this.assignmentService.getAssignmentsByTeacher().subscribe({
        next: (data: any[]) => this.loadAssignments = data,
        error: err => console.error("Error fetching assignments:", err)
      })
    );
  }

  closeModal() {
    this.showModal = false;
  }

      viewAssignment(assignment: any): void {
      // 1) If we have embedded Base64 + type, decode & preview
      const base64 = assignment.file?.content as string | null;
      const mime   = assignment.file?.contentType as string | null;
      const fileId = assignment.fileId as string | null;

      if (base64 && mime) {
        try {
          const bytes    = atob(base64);
          const buf      = new Uint8Array(bytes.length);
          for (let i = 0; i < bytes.length; i++) {
            buf[i] = bytes.charCodeAt(i);
          }
          const blob     = new Blob([buf], { type: mime });
          const url      = URL.createObjectURL(blob);
          window.open(url, '_blank');
          return;
        } catch (err) {
          console.error('Base64 preview error:', err);
          this.toastr.error('Cannot preview file from memory, attempting download…');
          // fall through to next branch
        }
      }

      // 2) Next, if we have a fileId, download & preview
      if (fileId) {
        this.assignmentService.downloadUploadedFile(fileId).subscribe({
          next: (blob: Blob) => {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
          },
          error: (err) => {
            console.error('Download preview error:', err);
            this.toastr.error(
              'Cannot preview this file but it will download for local viewing.'
            );
          }
        });
        return;
      }

      // 3) Otherwise, show the written assignment text
      if (typeof assignment.writtenAssignment === 'string' && assignment.writtenAssignment.trim()) {
        this.selectedAssignment = assignment;
        return;
      }

      // 4) Nothing to preview
      this.toastr.info('No file or written answer to preview.');
    }



  closeAssignment() {
    this.selectedAssignment = null;
  }

  downloadFile(fileId: string, fileName: string) {
      this.assignmentService.downloadUploadedFile(fileId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = fileName;
          anchor.click();
          URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Download error:', err);
          this.toastr.error("Failed to download the file");
        }
      });
    }


}
