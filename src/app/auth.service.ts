import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://community-app-v2.onrender.com/api/v1'; // Replace with your API base URL
  private _otpToken: string = '';

  constructor(private http: HttpClient) { }

  sendOTP(mobile: string) {
    return this.http.post<{ message: string }>(`${this.baseUrl}/public/auth/login`,
      {
        country: '63a052ca-1667-413c-8665-85514270337a',
        number: mobile,
        type: 'ADMIN',
      }
    ).pipe(
      switchMap((response: any) => {
        this._otpToken =
          response.data.otpToken ?? response.data.otpToken ?? '';
        return of(response);
      }),
    );
  }

  verifyOTP(mobile: string, otp: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._otpToken}`,
    });
    return this.http.post<any>(`${this.baseUrl}/user/verification/verify/mobile-number`,
      { otp },
      { headers },
    ).pipe(
      tap(res => {
        sessionStorage.setItem('token', res.data.accessToken);
        sessionStorage.setItem('refreshToken', res.data.refreshToken);
      })
    );
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/list`);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.clear();
  }
}
