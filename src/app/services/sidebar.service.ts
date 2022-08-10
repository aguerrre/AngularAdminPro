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
        {title: 'Progress', url: 'progress'},
        {title: 'Gráficas', url: 'charts'},
      ]
    },
  ];

  constructor() { }
}
