import { Inject, Injectable } from '@angular/core';
import { ContactoService } from './contacto.service.interface';
import { Contacto } from '../../shared/prismic/models/contacto.dto';
import { Sede } from '../../shared/prismic/models/sede.dto';
import { PrismicService } from '../../shared/prismic/prismic.service.interface';
import { Query } from '../../shared/prismic/query';
import { Whatsapp } from 'src/app/shared/prismic/models/whatsapp.dto';
import { Encuesta } from 'src/app/shared/prismic/models/encuesta.dto';

@Injectable({
  providedIn: 'root'
})
/// Servicio de contacto
export class ContactoServiceImpl implements ContactoService {
  private prismic: PrismicService;

  constructor(@Inject('PrismicService') prismic: PrismicService) {
    this.prismic = prismic;
  }

  /// Metodo para obtener la información de contacto
  getContacto(): Promise<Contacto> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('contacto')).then((response) => {
        return response.results;
      });
    });
  }

  /// Metodo para obtener las sedes de la empresa
  getSedes(): Promise<Sede[]> {
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('sedes')).then((response) => {
        const listaSedes: Sede[] = [];
        response.results.forEach(element => {
          var lista = [];
          element.data.telefonos.forEach(telefono => {
            lista.push(telefono.telefono[0].text);
          });
          listaSedes.push({
            sede: element.data.sede[0].text,
            direccion: element.data.direccion[0].text,
            telefonos: lista,
          });
        });
        return listaSedes;
      });
    });
  }

  /// Metodo para obtener la información de whatsapp
  getWhatsappInfo(): Promise<Whatsapp> {
    let info: Whatsapp;
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('whatsapp-info')).then((response) => {
        info = {
          numero: response.results[0].data.numero[0].text,
          mensaje: response.results[0].data.mensaje[0].text
        };
        return info;
      });
    });
  }

  /// Metodo para obtener la información de la encuesta de satisfacción
  getEncuestaSatisfaccion(): Promise<Encuesta> {
    let info: Encuesta;
    return this.prismic.buildContext().then(ct => {
      return ct.api.query(Query.byType('encuesta-satisfaccion')).then((response) => {
        info = {
          mensaje: response.results[0].data.mensaje[0].text,
          url: response.results[0].data.url[0].text,
        };
        return info;
      });
    });
  }
}
