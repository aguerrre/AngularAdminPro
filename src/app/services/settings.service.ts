import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Se obtiene el link al archivo css que carga el tema en el index.
  private linkTheme = document.querySelector('#theme');

  // Se establece el tema inicial al construirse el servicio.
  constructor() {
    this.setInitialTheme();
  }
  
  /**
   * Método privado que comprueba que en el localStorage del navegador exista algún tema elegido previamente por el usuario.
   * Si no es así, se establece uno (en este caso el default).
   */
  private setInitialTheme(): void {
    const storageTheme = localStorage.getItem('theme') || './assets/css/colors/default.css';
    this.linkTheme?.setAttribute('href', storageTheme);
  }

  /**
   * Cambia el tema actual. Se le pasa el string del tema (diferenciador del archivo css),
   * y se incluye en la url (valor del atributo href). Se establece entonces el atributo.
   * Se guarda en el localStorage el item 'theme' con el valor del atrib href seleccionado.
   * @param theme 
   */
  public changeTheme(theme: string) {

    const url = `./assets/css/colors/${theme}.css`;

    this.linkTheme?.setAttribute('href', url);
    localStorage.setItem('theme', url);

  }

  /**
   * Se obtiene la lista de links con los datos del tema y se itera. Por cada uno de ellos:
   *      - se elimina la clase 'working' que es la que da el check al tema seleccionado.
   *      - se obtiene el atributo data-theme (tiene el nombre diferenciador del archivo css de cada tema).
   *      - se aplica el nombre al supuesto valor del atributo href.
   *      - se obtiene el valor del atributo href del link que da el tema actual de la página.
   *      - se comprueba que el valor del linkactual y el del valor clicado sea igual.
   *        Si lo es, se añade la clase working a ese link.
   * 
   * @param changeThemeLinks 
   */
  public checkCurrentTheme(changeThemeLinks: NodeListOf<Element>) {

    const links: NodeListOf<Element> = changeThemeLinks;

    links.forEach(item => {
      item.classList.remove('working');

      const btnTheme = item.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');

      if (btnThemeUrl === currentTheme) {
        item.classList.add('working');
      }
    });

  }
}
