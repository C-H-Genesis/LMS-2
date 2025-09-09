import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../services/student.service';

export interface Result {
  courseId:      string;
  courseName:    string;
  averageScore:  number;
  letterGrade:   string;
  enrollmentDate: string;  // ISO string
  courseCode:    string;
}

@Component({
  selector: 'app-result',
  standalone: false,
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent  implements OnInit {
  results: Result[] = [];
  loading = false;

  constructor(
    private studentService: StudentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults() {
    this.loading = true;
    this.studentService.getResult().subscribe({
      next: (res) => {
        this.results = res;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to load results');
        this.loading = false;
      }
    });
  }
}