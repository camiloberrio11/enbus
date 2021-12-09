import { Inject, Injectable } from '@angular/core';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { InicioService } from './inicio.service.interface';
import { PopupInicio } from 'src/app/shared/prismic/models/popup-inicio.dto';

@Injectable({
  providedIn: 'root'
})
/// Servicio de inicio
export class InicioServiceImpl implements InicioService {
  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener la imagen del popup de inicio
  getPopupInicio(): Promise<PopupInicio> {
    let info: PopupInicio;
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('popup-inicio')).then((response) => {
        console.log('response: ', response);
        var link = '';
        var boton = '';
        if (response.results[0].data.link_boton.length > 0) {
          link = response.results[0].data.link_boton[0].text;
        }
        if (response.results[0].data.texto_boton.length > 0) {
          boton = response.results[0].data.texto_boton[0].text;
        }
        info = {
          imagen: response.results[0].data.imagen.url,
          link_boton: link,
          texto_boton: boton,
        };
        return info;
      });
    });
  }
}
