import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { Course } from '../DTOs/CourseModel';



// src/app/services/admin.service.ts
export interface UserDto {
  userId:            string;
  fullName:          string;
  username:          string;
  userType:          'Student' | 'Teacher' | 'Admin' | 'Finance';
  enrollmentDate:       string;            // ← you’ll need to extend your backend to return this
  // …other props…
}

export interface EnrollmentWithCourse {
  id:                number;
  courseId:          string;
  courseName:        string;
  userId:            string;
  status:            boolean;
  enrollmentDate:    string;
}

export interface Faculty {
  facultyId: number;
  facultyName: string;
  facultyCode: string;
}

export interface MonthlyUserStat {
  year: number;
  month: number;
  count: number;
}


@Injectable({
  providedIn: 'root',
})

export class AdminService {
  private baseUrl = 'sms-backend-fxewhpb0a6euedfr.centralus-01.azurewebsites.net/api/admin';
  
  

  constructor(private http: HttpClient, private authService: AuthService) {}


  getAllUsers() {
    console.log('AdminService.getAllUsers() called');
    const token = this.authService.getToken(); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/users`, { headers });
  }

  getMonthlyUserStats(): Observable<MonthlyUserStat[]> {
    const token   = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<MonthlyUserStat[]>(
      `${this.baseUrl}/stats/users/monthly`,
      { headers }
    );
  }

  getAllUsersById(Id: string) {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/users/${Id}`, { headers });
  }

  getAllUsersByRole(role: string){
    const token = this.authService.getToken(); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/user/${role}`, { headers })
  }

  getStudentsByFaculty(facultyId: number): Observable<any[]> {
  const token = localStorage.getItem('authToken') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(
    `${this.baseUrl}/GellFacultyStudents/${facultyId}`,
    { headers }
  );
}



  deleteUser(userId: string) {
    const token = this.authService.getToken(); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/delete-user/${userId}`, { headers });
  }

  createUser(userData: any) {
    const token = this.authService.getToken(); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/create-user`, userData, { headers });
  }

  updateUserInfo(Id : any, payload: any){
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/userInfo/${Id}`, payload ,{ headers });
  }

  //             Course Operations                       //

   getFaculties() : Observable<any> {
     const token = this.authService.getToken(); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/GetAllFaculties`, {headers});
   }

  getCourses(): Observable<Course[]> {
    const token = this.authService.getToken(); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Course[]>(`${this.baseUrl}/courses`, { headers });
  }

  addCourse(dto: {
  courseCode: string;
  courseName: string;
  teacherName: string;
  facultyName: string;
}): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
    return this.http.post(`${this.baseUrl}/Add-New-Course`, dto, { headers });
  }

  updateCourse(id: string, payload: any) : Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/UpdateCourses/${id}`, payload, { headers });
  }

  deleteCourse(courseId: string): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/delete-course/${courseId}`, { headers });
  }

  getEnrollmentsWithCourse(): Observable<EnrollmentWithCourse[]> {
    const token   = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<EnrollmentWithCourse[]>(
      `${this.baseUrl}/GetAllEnrollments`,
      { headers }
    );
  }

  addFaculty (data: {facultyName: string; facultyCode: string;}) : Observable<any> {
     const token   = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/CreateNewFaculty`,data, {headers});
  }

  modifyFaculty(data: {facultyName: string; facultyCode: string;}) : Observable<any> {
     const token   = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/UpdateFaculty`,data, {headers});
  }

        //         My ACCOUNT              //


  getProfilePicture() {
        const token = localStorage.getItem('authToken'); // Adjust based on how you store tokens
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.baseUrl}/profile-picture`,{ headers ,
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
          `${this.baseUrl}/profile-picture`,
          form,
          { headers }
        );
      }          

   GetProfile () :Observable<any> {
    const token = localStorage.getItem('authToken'); // Adjust if stored differently
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.baseUrl}/profile`, {headers});
  }

  UpdateProfile (profile: any) :Observable<any> {
    const token = localStorage.getItem('authToken'); // Adjust if stored differently
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.baseUrl}/UpdateProfile`,profile, {headers});
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
      const token = localStorage.getItem('authToken'); // Adjust if stored differently
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.post(`${this.baseUrl}/change-password`, data, { headers });
    }

    getAllRoles () {
      const token = localStorage.getItem('authToken'); // Adjust if stored differently
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}/AllRoles`, {headers})
    }

  assignRoles(userId: string, roles: string | string[]): Observable<any> {
    // Normalize to array of strings
    const payload = Array.isArray(roles) ? roles : [roles];

    // ensure we send proper content type and auth header if needed
    const token = localStorage.getItem('authToken'); // adapt to your auth storage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    return this.http.post(`${this.baseUrl}/AddRole/${userId}`, payload, { headers });
  }

  getUserRoles(Id: string): Observable<string[]> {
    const token = localStorage.getItem('authToken'); // Adjust if stored differently
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<string[]>(`${this.baseUrl}/GetUsersRoles/${Id}`, {headers});
  }

  // admin.service.ts
  removeUserRole(userId: string, roleId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    const encoded = encodeURIComponent(roleId);
    return this.http.delete(`${this.baseUrl}/${userId}/RemoveUserRole/${encoded}`, { headers } as any);
  }

  setUserActiveState(userId: string, isActive: boolean): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    
    // PATCH /api/admin/{userId}/active with boolean body
    return this.http.patch(`${this.baseUrl}/${userId}/active`, isActive, { headers } as any);
  }

  disableUser(userId: string) {
    return this.setUserActiveState(userId, false);
  }

  enableUser(userId: string) {
    return this.setUserActiveState(userId, true);
  }



  
}
