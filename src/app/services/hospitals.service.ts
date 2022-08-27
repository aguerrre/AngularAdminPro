import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalsService {

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

  getAll() {
    const url = `${base_url}/hospitals`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: any) => resp.hospitals)
      );
  }

  create(name: string) {
    const url = `${base_url}/hospitals`;
    return this.http.post(url, { name }, this.headers);
  }

  update(_id:string, name: string) {
    const url = `${base_url}/hospitals/${_id}`;
    return this.http.put(url, { name }, this.headers);
  }

  delete(_id:string) {
    const url = `${base_url}/hospitals/${_id}`;
    return this.http.delete(url, this.headers);
  }

}
