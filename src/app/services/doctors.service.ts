import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Doctor } from '../models/doctor.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

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
    const url = `${base_url}/doctors`;
    return this.http.get(url, this.headers)
      .pipe(
        delay(200),
        map((resp: any) => resp.doctors)
      );
  }

  getById(id: string) {
    const url = `${base_url}/doctors/${id}`;
    return this.http.get(url, this.headers);
  }

  create(doctor: Doctor) {
    const url = `${base_url}/doctors`;
    return this.http.post(url, doctor, this.headers);
  }

  update(doctor: Doctor) {
    const url = `${base_url}/doctors/${doctor._id}`;
    return this.http.put(url, doctor, this.headers);
  }

  delete(doctor: Doctor) {
    const url = `${base_url}/doctors/${doctor._id}`;
    return this.http.delete(url, this.headers);
  }

}
