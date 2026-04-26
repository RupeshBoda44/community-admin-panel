import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

const API = 'https://community-app-v2.onrender.com/api/v1';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  verifyUser(id: string) {
    return this.http.patch(`${API}/admin/user/verify/${id}`, { verified: true });
  }

  unverifyUser(id: string) {
    return this.http.patch(`${API}/admin/user/verify/${id}`, { verified: false });
  }

  getUsers(page: number, limit: number, search: string) {
    let params = new HttpParams()
      .set('page', page)
      .set('perPage', limit)
      .set('orderDirection', 'desc')
      .set('orderBy', 'createdAt');
    if (search) params = params.set('search', search);
    return this.http.get<any>(`${API}/admin/user/list`, { params });
  }
}