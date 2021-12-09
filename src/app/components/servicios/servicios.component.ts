import { Component, OnInit } from '@angular/core';
import { RutasServiceImpl } from '../../services/rutas/rutas.service';
import { Ruta } from '../../shared/prismic/models/ruta.dto';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
/// Componente dedicado para la página de servicios prestados por la empresa
export class ServiciosComponent implements OnInit {

  isMobileResolution: boolean;
  rutas: Ruta[];

  constructor(
    private rutasService: RutasServiceImpl,
  ) {
    if (window.innerWidth < 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  ngOnInit() {
    /// Hace la petición de las rutas que tiene la empresa
    this.rutasService.getRutas().then(data => this.rutas = data);
  }

}
