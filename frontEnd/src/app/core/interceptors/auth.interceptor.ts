import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const t = this.auth.getToken();
    if (t && req.url.startsWith('/api')) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${t}` } });
    }
    return next.handle(req);
  }
}