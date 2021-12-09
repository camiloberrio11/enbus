import { Injectable, Inject } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { DocumentosService } from './documentos.service.interface';
import { Documento } from '../../shared/prismic/models/documento.dto';

@Injectable({
  providedIn: 'root'
})
/// Servicio de documentos empresariales
export class DocumentosServiceImpl implements DocumentosService {

  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener los documentos de interés
  getDocumentos(): Promise<Documento[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('documentos')).then((response) => {
        const listaDocumentos: Documento[] = [];
        response.results.forEach(element => {
          listaDocumentos.push({
            nombre: element.data.nombre[0].text,
            archivo: element.data.archivo.url,
          });
        });
        return listaDocumentos;
      });
    });
  }
}
