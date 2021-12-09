import { Injectable, Inject } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { CovidService } from './covid.service.interface';

@Injectable({
  providedIn: 'root'
})
export class CovidServiceImpl implements CovidService {
  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener la información de contacto
  getInfo(): Promise<any> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('info-covid')).then((response) => {
        return response.results;
      });
    });
  }
}
