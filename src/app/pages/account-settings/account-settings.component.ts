import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  // Lista para guardar los links con los datos del tema.
  public links!: NodeListOf<Element>;

  // Inyección del servicio de settings.
  constructor(private settingsService: SettingsService) { }

  /**
   * En el inicio del componente se obtienen los links, ya que si se hace antes, no estarán cargados en el DOM.
   * Luego se llama al método del servicio que comprueba cuál es el link que está siendo usado actualmente.
   * Se pasan los links por parámetros, para llamar sólo una vez al DOM.
   */
  ngOnInit(): void {
    this.links = document.querySelectorAll('.selector');
    this.settingsService.checkCurrentTheme(this.links);
  }

  /**
   * Método para cambiar el tema, llama al método del servicio que lo hace, pasándole el string del tema
   * (nombre del archivo css).
   * Luego vuelve a comprobar el tema actual.
   * @param theme 
   */
  changeTheme(theme: string) {
    this.settingsService.changeTheme(theme);
    this.settingsService.checkCurrentTheme(this.links);
  }

}
