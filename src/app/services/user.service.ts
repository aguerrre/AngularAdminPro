import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { UsersPaginated } from '../interfaces/users-paginated.interface';

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

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
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

  getAllPaginated(page: number = 1) {
    const url = `${base_url}/users?page=${page}`;
    return this.http.get<UsersPaginated>(url, this.headers)
      // Con el map se instancian los User dentro del array de objects, 
      // para poder usar todos sus métodos(getImage), de lo contrario no funcionará.
      .pipe(
        delay(500),
        map(resp => {
          const users = resp.users.map(
            user => new User(user.first_name, user.email, '', user.img, user.google_auth, user.role, user.uid)
          )
          return {
            total: resp.total,
            totalPages: resp.totalPages,
            users: users
          };
        })
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
      role: this.user.role
    }
    return this.http.put(`${base_url}/users/${this.uid}`, formData, this.headers);
  }

  save(user: User) {
    return this.http.put(`${base_url}/users/${user.uid}`, user, this.headers);
  }

  delete(user: User) {
    const url = `${base_url}/users/${user.uid}`;
    return this.http.delete(url, this.headers);
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
