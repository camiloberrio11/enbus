import { Inject, Injectable } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { SliderService } from './slider.service.interface';
import { SliderInicio, SliderPerfil, SliderGaleria } from '../../shared/prismic/models/slider.dto';

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
