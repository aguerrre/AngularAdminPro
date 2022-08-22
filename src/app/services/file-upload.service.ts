import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async update(file: File, collection: 'users' | 'hospitals' | 'doctors', id: string) {
    try {

      const url = `${base_url}/uploads/${collection}/${id}`;
      const formData = new FormData();
      formData.append('image', file);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || '',
        },
        body: formData
      });
      // Esta funcion es para que me parsee el contenido de la respuesta al que originalmente debe enviar el backend,
      // si no, lo envía encapsulado en un readablestream
      const data = await resp.json();
      if (data.ok) {
        return data.filename;
      } else {
        console.log(data.msg);
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  }

}
