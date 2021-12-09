import { Inject, Injectable } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { ProtocolosService } from './protocolos.service.interface';
import { Protocolo } from 'src/app/shared/prismic/models/protocolo.dto';

@Injectable({
  providedIn: 'root'
})
export class ProtocolosServiceImpl implements ProtocolosService {

  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener los valores empresariales
  getProtocolos(): Promise<Protocolo[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('protocolos')).then((response) => {
        const listaValores: Protocolo[] = [];
        response.results.forEach(element => {
          listaValores.push({
            nombre: element.data.nombre[0].text,
            imagen: element.data.imagen.url,
          });
        });
        return listaValores;
      });
    });
  }
}
