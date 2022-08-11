import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

// funcion declarada globalmente en los assets (custom.js)
declare function customInitFunctions(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {



  constructor(private settingsService: SettingsService) {
  }

  // Al iniciarse llama a esa función para que cargue los plugins, ya que al iniciarse, sólo se cargan una vez,
  // y al reconstruirla nosotros de forma dinámica con angular, no se vuelve a disparar, por eso al (re)iniciar el
  // pagesComponent, disparamos de nuevo la función.
  ngOnInit(): void {
    customInitFunctions();
  }

}
