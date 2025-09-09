import { Component } from '@angular/core';
import { Course, StudentService } from '../../services/student.service';

@Component({
  selector: 'app-time-table',
  standalone: false,
  templateUrl: './time-table.component.html',
  styleUrl: './time-table.component.css'
})
export class TimeTableComponent {
  courses: Course[] = [];
selectedCourseId = '';

  constructor ( private studentService : StudentService) {}

  ngOnInit () {
    this.loadFacultyCourses();
  }

  loadFacultyCourses(): void {
  this.studentService.getCoursesByFaculty().subscribe({
    next: data => this.courses = data,
    error: err => console.error('Error loading courses:', err)
  });
}

}
