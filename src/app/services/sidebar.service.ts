import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [
    {
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        {title: 'Main', url: '/'},
        {title: 'Gráficas', url: 'charts'},
        {title: 'Progress', url: 'progress'},
        {title: 'Promises', url: 'promises'},
        {title: 'RxJs', url: 'rxjs'},
      ]
    },
  ];

  constructor() { }
}
