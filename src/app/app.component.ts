import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
// tslint:disable-next-line: ban-types
declare let gtag: Function;

import { ContactoServiceImpl } from './services/contacto/contacto.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('cookieBanner', [
      state(
        'inactive',
        style({
          bottom: '-200px',
          visibility: 'hidden',
        })
      ),
      state(
        'active',
        style({
          bottom: '0px',
          visibility: 'visible',
        })
      ),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('300ms ease-out')),
    ]),
  ],
})
export class AppComponent implements OnInit {
  public mediaButtonState = 'inactive';
  date = new Date().getFullYear();
  public cookieBannerState = 'active';
  route: string;

  title = 'web-flota-ospina';
  numero: string;
  mensaje: string;

  constructor(
    public router: Router,
    location: Location,
    private contactoService: ContactoServiceImpl
  ) {
    router.events.subscribe((val) => {
      if (location.path() !== '') {
        this.route = location.path();
      } else {
        this.route = 'Home';
      }
    });

    /// Integración con google analytics
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-170655790-1', {
          // tslint:disable-next-line: object-literal-key-quotes
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }

  ngOnInit() {
    /// Hace la petición de la información de whatsapp
    this.contactoService.getWhatsappInfo().then((dataWhatsapp) => {
      this.numero = dataWhatsapp.numero;
      this.mensaje = dataWhatsapp.mensaje;
    });
  }

  /// Metodo para ocultar el banner de advertencia sobre el uso de cookies
  hideCookieBanner() {
    this.cookieBannerState =
      this.cookieBannerState === 'inactive' ? 'active' : 'inactive';
  }

  /// Metodo para alternar la visibilidad de los botones de redes sociales
  toggleButtons() {
    this.mediaButtonState =
      this.mediaButtonState === 'inactive' ? 'active' : 'inactive';
  }
}
