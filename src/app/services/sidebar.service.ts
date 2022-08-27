import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

/*   public menu: any[] = [
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
    {
      title: 'Mantenimiento',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        {title: 'Usuarios', url: 'usuarios'},
        {title: 'Hospitales', url: 'hospitales'},
        {title: 'Médicos', url: 'medicos'},
      ]
    },
  ]; */

  public menu:any[] = [];

  constructor(private userService: UserService) {}

  loadMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')!) || [];

    if (this.menu.length === 0) {
      this.userService.logout();
    }
  }

}
