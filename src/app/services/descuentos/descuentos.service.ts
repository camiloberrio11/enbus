import { Injectable, Inject } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { DescuentosService } from './descuentos.service.interface';
import { Descuento } from 'src/app/shared/prismic/models/descuento.dto';

@Injectable({
  providedIn: 'root'
})
export class DescuentosServiceImpl implements DescuentosService {

  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  getDescuentos() {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('descuento')).then((response) => {
        return response.results;
      });
    });
  }
}
