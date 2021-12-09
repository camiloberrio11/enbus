import { Inject, Injectable } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { FaqService } from './faq.service.interface';
import { Faq } from '../../shared/prismic/models/faq.dto';

@Injectable({
  providedIn: 'root'
})
/// Servicio de preguntas frecuentes
export class FaqServiceImpl implements FaqService {

  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener todas las preguntas frecuentes
  getFaqs(): Promise<Faq[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('faq')).then((response) => {
        const listaFaqs: Faq[] = [];
        response.results.forEach(element => {
          listaFaqs.push({
            pregunta: element.data.pregunta[0].text,
            respuesta: element.data.respuesta[0].text,
          });
        });
        return listaFaqs;
      });
    });
  }

  /// Metodo para obtener 3 preguntas frecuentes
  get3Faqs(): Promise<Faq[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('faq')).then((response) => {
        const listaFaqs: Faq[] = [];
        response.results.forEach(element => {
          listaFaqs.push({
            pregunta: element.data.pregunta[0].text,
            respuesta: element.data.respuesta[0].text,
          });
        });
        return listaFaqs.slice(0, 3);
      });
    });
  }
}
