import { Injectable, Inject } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { ObligacionesPasajeroService } from './obligaciones-pasajero.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ObligacionesPasajeroServiceImpl implements ObligacionesPasajeroService {
  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  getInfo(): Promise<any> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('obligaciones-pasajero')).then((response) => {
        return response.results;
      });
    });
  }
}
