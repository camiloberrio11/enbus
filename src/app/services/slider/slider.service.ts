import { EmpresaAsociada } from './../../shared/prismic/models/slider.dto';
import { Inject, Injectable } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { SliderService } from './slider.service.interface';
import { SliderInicio, SliderPerfil, SliderGaleria, CardHome } from '../../shared/prismic/models/slider.dto';

@Injectable({
  providedIn: 'root'
})
/// Servicio de sliders
export class SliderServiceImpl implements SliderService {

  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener las imágenes del slider de la sección de inicio
  getSliderInicio(): Promise<SliderInicio[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('slider-inicio')).then((response) => {
        const listaSlider: SliderInicio[] = [];
        response.results.forEach(element => {
          listaSlider.push({
            imagen: element.data.imagen.url,
          });
        });
        return listaSlider;
      });
    });
  }

  /// Metodo para obtener las imágenes del slider de la sección de perfil
  getSliderPerfil(): Promise<SliderPerfil[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('slider-perfil')).then((response) => {
        const listaSlider: SliderPerfil[] = [];
        response.results.forEach(element => {
          listaSlider.push({
            imagen: element.data.imagen.url,
          });
        });
        return listaSlider;
      });
    });
  }

  getCardsHome(): Promise<CardHome[]> {
    return this.prismic.buildContext().then((ct) => {
      return ct.api.query(Query.byType("tarjetas-inicio")).then((response) => {
        const listaSlider: CardHome[] = [];
        const cards = response.results[0].data.tarjeta;
        cards.forEach((element) => {
          listaSlider.push({
            img: element.image_card,
            title: element.title_card,
            description: element.description_card,
            linkExternal: element.external_link,
            labelBtn: element.label_button
          });
        });
        return listaSlider;
      });
    });
  }

  getEmpresasAsociadas(): Promise<EmpresaAsociada[]> {
    return this.prismic.buildContext().then((ct) => {
      return ct.api.query(Query.byType("empresas-asociadas")).then((response) => {
        const cards = response.results[0].data.tarjeta_empresa;
        return cards;
      });
    });
  }

  /// Metodo para obtener las imágenes del slider de la sección de la galería
  getSliderGaleria(): Promise<SliderGaleria[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('slider-galeria')).then((response) => {
        const listaSlider: SliderGaleria[] = [];
        response.results.forEach(element => {
          listaSlider.push({
            imagen: element.data.imagen.url,
          });
        });
        return listaSlider;
      });
    });
  }
}
