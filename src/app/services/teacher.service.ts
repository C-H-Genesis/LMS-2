import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SubmissionForTeacherDto } from '../DTOs/TeacherSubmissionDto';
import { GradeSubmissionDto } from '../DTOs/GradeSubmissionDto';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/api`;
  errorMessage: string | null = null;
  courses: any[] = [];

  constructor(private http: HttpClient) { }

  getProfile () :Observable<any> {
    const token = localStorage.getItem('authToken'); // Adjust if stored differently
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/Teachers/profile`, {headers});
  }
   
  updateProfile (profile:any) :Observable<any> {
     const token = localStorage.getItem('authToken'); // Adjust if stored differently
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/Teachers/UpdateProfile`,profile, {headers});
  }


   changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
      const token = localStorage.getItem('authToken'); // Adjust if stored differently
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.post(`${this.apiUrl}/Teachers/change-password`, data, { headers });
    }

  loadCourses(): Observable<any> {
   
    const token = localStorage.getItem('authToken'); // Assuming the JWT token is saved in local storage

    if (!token) {
      console.error("No auth token found!");
      return new Observable(observer => observer.error("No auth token found"));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/Teachers/GetCourses`, { headers }); 
  }

  getStudentsByCourseCode(courseCode: string): Observable<any[]> {
    if (!courseCode.trim()) {
      return throwError(() => new Error('Please enter a valid course code.'));
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/teachers/students/${courseCode.trim()}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching students:', error);
          return throwError(() => new Error('Failed to load students. Please check the course code and try again.'));
        })
      );
  }

  // Before: returned type was `{ fileUrl: string }`
uploadFile(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error("No auth token found!");
    return throwError(() => "No auth token found");
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Change the generic to `{ fileId: string }`
  return this.http
    .post<{ fileId: string }>(
      `${this.apiUrl}/teachers/uploadAssignmentFile`,
      formData,
      { headers }
    )
    // 🔥 Extract `fileId` instead of `fileUrl`
    .pipe(map(response => response.fileId));
}

  

    createAssignment(assignmentData: {
      title: string;
      description: string;
      WrittenAssignment?: string;
      dueDate: string;      // ISO date (e.g. "2025-06-15")
      courseId: string;     // GUID
      fileId?: string;      // GUID returned by uploadFile()
    }): Observable<any> {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("No auth token found!");
        return throwError(() => "No auth token found");
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      // Send JSON with fileId (if any) instead of fileUrl
      const payload = {
        title: assignmentData.title,
        description: assignmentData.description,
        WrittenAssignment: assignmentData.WrittenAssignment,
        dueDate: new Date(assignmentData.dueDate).toISOString(),
        courseId: assignmentData.courseId,
        fileId: assignmentData.fileId // may be undefined
      };

      return this.http.post(
        `${this.apiUrl}/teachers/createNewAssignment`,
        payload,
        { headers }
      );
    }


  getAssignmentsByTeacher(): Observable<{
      id: string;
      title: string;
      description: string;
      dueDate: string;
      createdAt: string;
      writtenAssignment?: string;
      courseName: string;
      file?: {
        fileId: string;
        fileName: string;
        contentType: string;
        content: string;  // Base64 string
      };
    }[]> {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("No auth token found!");
        return throwError(() => "No auth token found");
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get<any[]>(
        `${this.apiUrl}/teachers/GetAllAssignments`,
        { headers }
      );
    }

    downloadUploadedFile(fileId: string): Observable<Blob> {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return new Observable(observer => observer.error("No auth token found"));
      }

      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`);

      return this.http.get(`${this.apiUrl}/teachers/downloadUploadedFile/${fileId}`, {
        headers,
        responseType: 'blob'
      });
    }

    getAllSubmissions(): Observable<SubmissionForTeacherDto[]> {
    const token = localStorage.getItem('authToken'); // Assuming the JWT token is saved in local storage

    if (!token) {
      console.error("No auth token found!");
      return new Observable(observer => observer.error("No auth token found"));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<SubmissionForTeacherDto[]>(
      `${this.apiUrl}/teachers/AllSubmissions`, 
      { headers }
    );
  }

   gradeSubmission(id: string, dto: GradeSubmissionDto): Observable<any> {
    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(
      `${this.apiUrl}/teachers/submissions/${id}/grade`,
      dto,
      { headers }
    );
  }

  // in teacher.service.ts
updateGrade(submissionId: string, dto: GradeSubmissionDto): Observable<any> {
  const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.put(
    `${this.apiUrl}/teachers/submissions/${submissionId}/grade`,
    dto,
    { headers }
  );
}


  
}
