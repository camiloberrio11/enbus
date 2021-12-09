import { Inject, Injectable } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { PerfilService } from './perfil.service.interface';
import { Valor } from '../../shared/prismic/models/valor.dto';
import { Documento } from 'src/app/shared/prismic/models/documento.dto';

@Injectable({
  providedIn: 'root'
})
/// Servicio de perfil de la empresa
export class PerfilServiceImpl implements PerfilService {
  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener la misión empresarial
  getMision(): Promise<string> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('mision')).then((response) => {
        return response.results[0].data.texto[0].text;
      });
    });
  }

  /// Metodo para obtener la visión empresarial
  getVision(): Promise<string> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('vision')).then((response) => {
        return response.results[0].data.texto[0].text;
      });
    });
  }

  /// Metodo para obtener los valores empresariales
  getValores(): Promise<Valor[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('valor_corporativo')).then((response) => {
        const listaValores: Valor[] = [];
        response.results.forEach(element => {
          listaValores.push({
            valor: element.data.valor[0].text,
            descripcion: element.data.descripcion[0].text,
          });
        });
        return listaValores;
      });
    });
  }
}
