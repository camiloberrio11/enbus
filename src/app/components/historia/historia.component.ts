import { Component, OnInit } from '@angular/core';
import { HistoriaServiceImpl } from '../../services/historia/historia.service';
import { Acontecimiento } from '../../shared/prismic/models/acontecimiento.dto';
import { Premio } from '../../shared/prismic/models/premio.dto';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.css']
})

/**
 * Componente dedicado para la página de historia de la empresa
 * Se encarga de mostrar los datos de la historia de la empresa
 */
export class HistoriaComponent implements OnInit {

  historia: string;
  acontecimientos: Acontecimiento[];
  premios: Premio[];

  constructor(
    private historiaService: HistoriaServiceImpl,
  ) { }

  /**
   * Obtiene los datos que se van a mostrar
   */
  ngOnInit() {
    /// Petición de la historia de la empresa
    this.historiaService.getHistoria().then(data => this.historia = data);
    /// Petición de los acontecimientos históricos de la empresa
    this.historiaService.getAcontecimientos().then(data => this.acontecimientos = data);
    /// Petición de los premios y reconocimientos otorgados a la compañía
    this.historiaService.getPremios().then(data => this.premios = data);
  }

}
