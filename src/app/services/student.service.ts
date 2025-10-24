import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { RegisterCourseDto } from '../DTOs/RegisterCourseDto';
import { Result } from '../components/result/result.component';



export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  
      private apiUrl = 'https://sms-backend-fxewhpb0a6euedfr.centralus-01.azurewebsites.net/api/Student'; // Replace with actual API base URL

      constructor(private http: HttpClient, private authService: AuthService) {}

      getProfile(): Observable<any> {
        const token = this.authService.getToken();
        if (!token) {
          console.error('Token is missing. User must log in.');
        throw new Error('Token is missing. User must log in.');
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
          tap((data) => console.log('Fetched profile:')),
          catchError((error) => {
            console.error('Error fetching profile:', error);
            return throwError(error);
          })
        );
      }

       getProfilePicture() {
        const token = localStorage.getItem('authToken'); // Adjust based on how you store tokens
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/profile-picture`,{ headers ,
          responseType: 'blob'
        });
      }

      uploadProfilePicture(file: File): Observable<{ message: string }> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          // NOTE: DON'T set Content-Type here; the browser will add the correct multipart boundary.
          ;

        const form = new FormData();
        form.append('File', file, file.name);

        return this.http.post<{ message: string }>(
          `${this.apiUrl}/profile-picture`,
          form,
          { headers }
        );
      }


    updateProfile(profile: any): Observable<any> {
      const token = localStorage.getItem('authToken'); // Adjust based on how you store tokens
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.put(`${this.apiUrl}/profile`, profile, { headers });
    }

    changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
      const token = localStorage.getItem('authToken'); // Adjust if stored differently
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.post(`${this.apiUrl}/change-password`, data, { headers });
    }


    registerCourse(courseData: RegisterCourseDto): Observable<any> {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<{ message: string }>(`${this.apiUrl}/registerCourse`, courseData, { headers });
    }

    getRegisteredCourses(): Observable<any> {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/registered-courses`, { headers });
    }

    getAssignmentsByCourse(): Observable<any[]> {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any[]>(`${this.apiUrl}/Assignments`,{ headers });
    }

      postSubmission(
      payload: {
        assignmentId: string;
        courseId: string;
        userId: string;
        writtenSubmission: string | null;
        submittedAt: string;
      },
      file: File | null
    ): Observable<any> {
      // 1) Build a FormData object
      const formData = new FormData();
      formData.append('AssignmentId', payload.assignmentId);
      formData.append('CourseId', payload.courseId);
      formData.append('UserId', payload.userId);
      formData.append('SubmittedAt', payload.submittedAt);

      // If there's a writtenSubmission, append that too (server will accept null/empty if file is provided).
      if (payload.writtenSubmission && payload.writtenSubmission.trim().length > 0) {
        formData.append('WrittenSubmission', payload.writtenSubmission.trim());
      } else {
        // In case of a purely file‐based submission, send an empty string (or omit entirely).
        formData.append('WrittenSubmission', '');
      }

      // 2) If a File was provided, append it under the exact same name your API expects:
      //    Your C# action parameter is named "File", so the key must be "File".
      if (file) {
        formData.append('File', file, file.name);
      }

      // 3) Authorization header (Bearer token) — adjust if you store token elsewhere:
      const token = localStorage.getItem('authToken') || '';
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
        // NOTE: Do NOT set 'Content-Type' here. Let the browser set it to multipart/form‐data with boundary.
      });

      // 4) POST to your combined endpoint
      //    Use `{ headers }` so that Angular adds the JWT, and FormData is marshalled correctly.
      return this.http.post(
        `${this.apiUrl}/PostSubmission`,
        formData,
        { headers }
      );
    }

    downloadUploadedFile(fileId: string): Observable<Blob> {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get(`${this.apiUrl}/Submissions/getUploadedFile/${fileId}`, {
        headers,
        responseType: 'blob' // Needed to get binary data
      });
    }

    getCoursesByFaculty(): Observable<Course[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Course[]>(
      `${this.apiUrl}/GetAllCoursesByFaculty`,
      { headers }
    );
  }

  getResult () : Observable<Result[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Result[]>(`${this.apiUrl}/results`, {headers})
  }


}
