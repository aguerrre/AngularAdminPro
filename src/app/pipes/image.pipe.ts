import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const api_url = environment.base_url;

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, collection: 'users'|'doctors'|'hospitals'): string {
    if (img) {
      return img.includes('https') ? img : `${api_url}/uploads/${collection}/${img}`;
    } else {
      return `${api_url}/uploads/${collection}/no-image`;
    }
  }

}
