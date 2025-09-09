export interface EnrollmentWithCourse {
  id:             number;
  courseId:       string;
  courseName:     string;
  userId:         string;
  status:         boolean;
  enrollmentDate: string;  // ISO string
}