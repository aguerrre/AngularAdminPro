import { EventEmitter, Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImgService {

  private _hideModal: boolean = true;
  public collection!: 'users' | 'doctors' | 'hospitals';
  public id: string | undefined = '';
  public img: string = 'no-image';

  public newImage: EventEmitter<string> = new EventEmitter<string>();

  get hideModal() {
    return this._hideModal;
  }

  openModal(collection: 'users' | 'doctors' | 'hospitals', id: string | undefined, img?: string) {
    this._hideModal = false;
    this.collection = collection;
    this.id = id;
    if (img?.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/uploads/${collection}/${img}`;
    }
  }
  closeModal() {
    this._hideModal = true;
  }

  constructor() { }
}
