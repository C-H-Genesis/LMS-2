import { Component, OnInit } from '@angular/core';
import { AdminService, Faculty } from '../../services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-manage-courses',
    templateUrl: './manage-courses.component.html',
    styleUrl: './manage-courses.component.css',
    standalone: false
})
export class ManageCoursesComponent implements OnInit {
  courses: any[] = [];
  errorMessage = '';
  showModal = false;
  faculties : any[] =[];
  isEditMode = false;
  selectedCourseId: string | null = null;
   formModel = {
    courseCode: '',
    courseName: '',
    teacherName: '',
    selectedFaculty: null as Faculty | null
  };


  constructor(private courseService: AdminService, private router: Router,  private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadFaculties();
  }

  loadFaculties () {
    this.courseService.getFaculties(). subscribe(
      (data) => {
        this.faculties = data;
      }, 
      (error) => {
        console.error("Error retrieving Faculties", error);
      }
    )
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(
      (courses) => {
        this.courses = courses;
      },
      (error) => {
        console.error('Error loading courses', error);
      }
    );
  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedCourseId = null;
    this.formModel = { courseCode: '', courseName: '', teacherName: '', selectedFaculty: null};
    this.showModal = true;
  }

   openEditModal(course: any) {
    this.isEditMode = true;
    this.selectedCourseId = course.id;
    const found = this.faculties.find(f => f.facultyCode === course.facultyCode) || null;
    this.formModel = {
      courseCode: course.courseCode,
      courseName: course.courseName,
      teacherName: course.teacherName,
      selectedFaculty:  found
    };
    this.showModal = true;
  }

 closeModal() {
    this.showModal = false;
    this.errorMessage = '';
  }


  addCourse(): void {
    const faculty = this.formModel.selectedFaculty;
    if (!faculty) {
      this.errorMessage = 'Please pick a faculty';
      return;
    }

      const payload = {
      courseCode:   this.formModel.courseCode,
      courseName:   this.formModel.courseName,
      teacherName:  this.formModel.teacherName,
      facultyName:  faculty.facultyName,
      
    };
      if (this.isEditMode && this.selectedCourseId) {
      // UPDATE  
      this.courseService.updateCourse(this.selectedCourseId, payload)
        .subscribe({
          next: () => { 
            this.toastr.success("Course updated");
            this.loadCourses();
            this.closeModal();
          },
          error: err => {
            console.error(err);
            this.toastr.error(err.error || 'Update failed');
          }
        });
    } else {
       const createDto = {
      courseCode:  this.formModel.courseCode,
      courseName:  this.formModel.courseName,
      teacherName: this.formModel.teacherName,
      facultyName:  faculty.facultyName
    };
      // CREATE
      this.courseService.addCourse(createDto)
        .subscribe({
          next: () => {
            this.toastr.success("Course added");
            this.loadCourses();
            this.closeModal();
          },
          error: err => {
            console.log(err);
            this.toastr.error(err.error || 'Creation failed');
          }
        });
    }
  }
  
    deleteCourse(courseId: string) {
    // 1) Replace the native confirm(...) with SweetAlert2
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it'
    }).then(result => {
      if (result.isConfirmed) {
        // 2) If user clicked “Yes, delete it”, call your service:
        this.courseService.deleteCourse(courseId).subscribe({
          next: () => {
            this.toastr.success('Course deleted successfully', 'Deleted');
            // Optionally refresh your list of courses here:
            this.loadCourses();
          },
          error: err => {
            this.toastr.error('Failed to delete course', 'Error');
            console.error(err);
          }
        });
      }
      // Otherwise, if result.isDismissed or result.isDenied, do nothing.
    });
  }
  }
  