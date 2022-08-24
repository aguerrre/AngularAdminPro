import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  private resultToUser(result: any[]): User[] {
    return result.map(
      user => new User(user.first_name, user.email, '', user.img, user.google_auth, user.role, user.uid)
    );
  }

  search(collection: 'users' | 'doctors' | 'hospitals', term: string) {
    const url = `${base_url}/all/${collection}/${term}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map((resp: any) => {
          switch (collection) {
            case 'users':
              return this.resultToUser(resp.results)
            default:
              return [];
          }
        }),
      )
  }
}
