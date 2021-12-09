import { Inject, Injectable } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { Testimonio } from '../../shared/prismic/models/testimonio.dto';
import { TestimoniosService } from './testimonios.service.interface';

@Injectable({
  providedIn: 'root'
})
/// Servicio de testimonios
export class TestimoniosServiceImpl implements TestimoniosService {

  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener todos los testimonios de los usuarios
  getTestimonios(): Promise<Testimonio[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('testimonio')).then((response) => {
        const listaTestimonioes: Testimonio[] = [];
        response.results.forEach(element => {
          listaTestimonioes.push({
            persona: element.data.persona[0].text,
            testimonio: element.data.testimonio[0].text,
          });
        });
        return listaTestimonioes;
      });
    });
  }

  /// Metodo para obtener 2 testimonios de los usuarios
  get2Testimonios(): Promise<Testimonio[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('testimonio')).then((response) => {
        const listaTestimonioes: Testimonio[] = [];
        response.results.forEach(element => {
          listaTestimonioes.push({
            persona: element.data.persona[0].text,
            testimonio: element.data.testimonio[0].text,
          });
        });
        return listaTestimonioes.slice(0, 2);
      });
    });
  }
}
