import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { RegisterCourseDto } from '../../DTOs/RegisterCourseDto';
import { ToastrService } from 'ngx-toastr';
import { error } from 'node:console';





@Component({
    selector: 'app-course-registration',
    templateUrl: './course-registration.component.html',
    styleUrl: './course-registration.component.css',
    standalone: false
})
export class CourseRegistrationComponent  implements OnInit {
  registerCourseDto! : RegisterCourseDto;
  registeredCourses: any[] = [];
  showModal = false;
  FacultyCourses: any

  constructor(private studentService: StudentService,  private toastr: ToastrService ) {}

  ngOnInit(): void {
    this.registerCourseDto = {
      CourseCode: '',
    };
    this.fetchRegisteredCourses();
    this.getCoursesByfaculty();
  }
  
  openModal() : void {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  registerCourse(): void { 

   this.studentService.registerCourse(this.registerCourseDto).subscribe({
      next: ({ message }) => {
        // HTTP 200 or 201 comes here:
        this.toastr.success(message);
      },
      error: err => {
        // HTTP 4xx/5xx comes here:
        // err.error is the parsed JSON body: { message: "..." }
        const errorMsg = err.error?.message || 'Something went wrong';
        this.toastr.error(errorMsg);
      }
    });
  }

  fetchRegisteredCourses(): void {
    this.studentService.getRegisteredCourses().subscribe(
      (courses) => {
        this.registeredCourses = courses;
      },
      (error) => {
        
        this.registeredCourses = [];
      }
    );
  }

  getCoursesByfaculty (): void {
    this.studentService.getCoursesByFaculty().subscribe(
      (courses) => {
        this.FacultyCourses = courses;
      },
      (error) => {
        this.FacultyCourses = '';
      }
    )
    
  }

 
}
