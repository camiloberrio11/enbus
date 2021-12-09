import { Inject, Injectable } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { RutaService } from './rutas.service.interface';
import { Query } from '../../shared/prismic/query';
import { Ruta } from '../../shared/prismic/models/ruta.dto';

@Injectable({
  providedIn: 'root'
})
/// Serivicio de rutas de la empresa
export class RutasServiceImpl implements RutaService {

  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener las rutas que cubre la empresa
  getRutas(): Promise<Ruta[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('ruta')).then((response) => {
        const listaRutas: Ruta[] = [];
        response.results.forEach(element => {
          var lista = [];
          element.data.horarios.forEach(hora => {
            lista.push(hora.hora[0].text);
          });
          listaRutas.push({
            ruta: element.data.ruta[0].text,
            precio: element.data.precio[0].text,
            horarios: lista,
          });
        });
        return listaRutas;
      });
    });
  }
}
