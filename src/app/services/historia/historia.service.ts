import { Inject, Injectable } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { HistoriaService } from './historia.service.interface';
import { Query } from '../../shared/prismic/query';
import { Acontecimiento } from '../../shared/prismic/models/acontecimiento.dto';
import { Premio } from '../../shared/prismic/models/premio.dto';
import { DatosEmpresa } from 'src/app/shared/prismic/models/datosEmpresa.dto';

@Injectable({
  providedIn: 'root'
})
///Servicio de historia de la empresa
export class HistoriaServiceImpl implements HistoriaService {
  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener los datos de la empresa
  getDatosEmpresa(): Promise<DatosEmpresa> {
    let info: DatosEmpresa;
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('datos-empresa')).then((response) => {
        info = {
          experiencia: response.results[0].data.experiencia[0].text,
          rutas: response.results[0].data.rutas[0].text,
          ciudades: response.results[0].data.ciudades[0].text,
        };
        return info;
      });
    });
  }

  /// Metodo para obtener la historia de la empresa
  getHistoria(): Promise<string> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('historia')).then((response) => {
        return response.results[0].data.historia[0].text;
      });
    });
  }

  /// Metodo para obtener los acontecimientos históricos de la empresa
  getAcontecimientos(): Promise<Acontecimiento[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('acontecimiento')).then((response) => {
        const listaAcontecimientos: Acontecimiento[] = [];
        response.results.forEach(element => {
          listaAcontecimientos.push({
            fecha: element.data.fecha[0].text,
            descripcion: element.data.descripcion[0].text,
          });
        });
        return listaAcontecimientos.sort((a, b) => {
          if (a.fecha > b.fecha) {
            return -1;
          }
          if (a.fecha < b.fecha) {
            return 1;
          }
          return 0;
        });
      });
    });
  }

  /// Metodo para obtener los premios y recompensas otorgados a la empresa
  getPremios(): Promise<Premio[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('premios_y_reconocimientos')).then(function (response) {
        const listaPremios: Premio[] = [];
        response.results.forEach(element => {
          listaPremios.push({
            nombre: element.data.nombre[0].text,
            imagen: element.data.imagen.url,
          });
        });
        return listaPremios;
      });
    });
  }
}
