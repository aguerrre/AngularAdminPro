import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { User } from '../models/user.model';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user!: User;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user.uid || '';
  }

  validateToken(): Observable<boolean> {
    return this.http.get(`${base_url}/auth/renew`,
      {
        headers: {
          'x-token': this.token
        }
      }).pipe(
        tap((resp: any) => {
          const { first_name, email, img, google_auth, role, uid } = resp.user;
          this.user = new User(first_name, email, '', img, google_auth, role, uid);
          localStorage.setItem('token', resp.token);
        }),
        map(resp => true),
        catchError(error => of(false))
      )
  }

  create(formData: RegisterForm) {
    return this.http.post(`${base_url}/users`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  update(formData: { email: string, first_name: string, role?: string }) {
    formData = {
      ...formData,
      role: this.user.role,
    };
    return this.http.put(`${base_url}/users/${this.uid}`, formData, {
      headers: {
        'x-token': this.token
      }
    });
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/auth/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/auth/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    google.accounts.id.revoke('maxixa92@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    })
  }
}
