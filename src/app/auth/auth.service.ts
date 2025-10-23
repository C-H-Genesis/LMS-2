import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from "../environments/environment";
import { RegisterRequest } from '../DTOs/RegisterRequest';
import { LoginRequest } from "../DTOs/LoginRequest";
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface JwtPayload { exp?: number; }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient, 
    private router: Router,
     @Inject(PLATFORM_ID) private platformId: any,
  ) {this.isBrowser = isPlatformBrowser(this.platformId);
}

    isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return true;                  // no exp → assume valid
    return exp * 1000 > Date.now();
  }

  // Register method
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Login method
  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Save token to localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Retrieve token from localStorage
 getToken(): string | null {
 return this.isBrowser
      ? localStorage.getItem('authToken')
      : null;
}


   // Decode token to get role
   getRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null; // Assuming the token has a 'role' field
      } catch (err) {
        console.error('Error decoding token', err);
        return null;
      }
    }
    return null;
  }

   getUserName(): string | null {
   const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null; // Assuming the token has a 'role' field
      } catch (err) {
        console.error('Error decoding token', err);
        return null;
      }
    }
    return null;
  }


  // Logout method
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/home']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email })
  }

  resetPassword(data: { email: string; token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

   getProfilePicture(): Observable<Blob> {
    if (!this.isBrowser) {
      // SSR or non‑browser: don’t even try localStorage or HTTP
      return of(new Blob());
    }

    // Safe: getToken() already checks isBrowser
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${this.apiUrl}/avatar`, {
      headers,
      responseType: 'blob'
    });
  }

}