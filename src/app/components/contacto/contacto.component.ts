import { Component, OnInit } from '@angular/core';
import { ContactoServiceImpl } from '../../services/contacto/contacto.service';
import { Sede } from '../../shared/prismic/models/sede.dto';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
/**
 * Componente dedicado para la página de contacto
 * Se encarga de mostrar los datos de contacto y la ubicación
 */
export class ContactoComponent implements OnInit {

  isMobileResolution: boolean;
  sedes: Sede[];

  constructor(
    private contactoService: ContactoServiceImpl,
  ) {
    if (window.innerWidth <= 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  /**
   * Obtiene las sedes donde está ubicada la empresa
   */
  ngOnInit() {
    this.contactoService.getSedes().then(data => this.sedes = data);
  }
}
