import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { LoginResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase;
  private key = 'token';
  constructor(private http: HttpClient) {}
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, password });
  }
  setToken(t: string) { localStorage.setItem(this.key, t); }
  getToken() { return localStorage.getItem(this.key) || ''; }
  isLoggedIn() { return !!this.getToken(); }
  logout() { localStorage.removeItem(this.key); }
}