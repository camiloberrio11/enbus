import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reserva } from 'src/app/models/reserva.dto';
import { MetodoPago } from 'src/app/models/metodo-pago.dto';
import { EndpointService } from '../endpoint/endpoint.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
/// Servicio de manejo de datos
export class DataService {

  constructor(
    private http: HttpClient,
    private endpointService: EndpointService,
  ) { }

  /**
   * Metodo para obtener los origenes disponibles
   */
  public getOrigenes() {
    return this.http.get(this.endpointService.getEndpoint + 'ibe/origenes/');
  }

  /**
   * Metodo para obtener los destinos disponibles con base en un origen
   * @param origen Origen del viaje
   */
  public getDestinos(origen: string) {
    return this.http.get(this.endpointService.getEndpoint + `ibe/destinos/?origen=${origen}`);
  }

  /**
   * Metodo para obtener la fecha máxima de viaje en base a un origen y un destino
   * @param origen Origen del viaje
   * @param destino Destino del viaje
   */
  public getFecha(origen: string, destino: string) {
    return this.http.get(this.endpointService.getEndpoint + `ibe/fecha_maxima/?origen=${origen}&destino=${destino}`);
  }

  /**
   * Metodo para obtener la lista de viajes con un origen, destino y una fecha específica
   * @param origen Origen del viaje
   * @param destino Destino del viaje
   * @param fecha Fecha del viaje
   */
  public getEnrutamientos(origen: string, destino: string, fecha: string) {
    return this.http.get(this.endpointService.getEndpoint + `ibe/enrutamientos/?origen=${origen}&destino=${destino}&fecha=${fecha}`);
  }

  /**
   * Metodo para obtener el resumen detallado de compra
   * @param valor valor de la compra
   * @param metodoPago Metodo de pago
   */
  public getCobros(valor: string, metodoPago?: string, cupon?: string) {
    let ruta = this.endpointService.getEndpoint + `ibe/configuracion/?valor=${valor}`;

    if (metodoPago != null) {
      ruta += `&metodo=${metodoPago}`;
    }
    if (cupon != null) {
      ruta += `&cupon=${cupon}`;
    }

    console.log(ruta);

    return this.http.get(ruta);
  }

  /**
   * Metodo para consultar la informacion de un pasajero
   * @param documento Documento del pasajero
   */
  public getDatosPasajero(documento: string) {
    return this.http.get(this.endpointService.getEndpoint + `ibe/pasajero/${documento}/`);
  }

  /**
   * Metodo para hacer la reserva de un tiquete
   * @param reserva Datos de la reserva
   */
  public reservarTiquetes(reserva: Reserva) {
    // return this.http.post(this.endpointService.getEndpoint + 'crear/tiquete/', reserva);

    const pasajeros = [];

    reserva.pasajeros.forEach(pax => {
      pasajeros.push({
        nombre: `${pax.nombre} ${pax.apellidos}`,
        documento: pax.documento,
        correo: pax.correo,
        telefono: pax.telefono,
        tipo_documento: pax.tipo_documento,
        puesto_ida: pax.puesto_ida,
        puesto_vuelta: pax.puesto_vuelta,
        clase_ida: pax.clase_ida,
        clase_vuelta: pax.clase_vuelta,
      });
    });

    const jsonBody = {
      pasajeros,
      enrutamiento_ida: reserva.enrutamiento_ida,
      enrutamiento_vuelta: reserva.enrutamiento_vuelta,
      fecha_compra: reserva.fecha_compra,
      metodo_pago: reserva.metodo_pago,
      comprador: reserva.comprador,
      cupon: reserva.cupon
    };

    return this.http.post(this.endpointService.getEndpoint + 'ibe/crear/tiquete/',
      jsonBody
    );
  }

  /**
   * Metodo para obtener el tiempo de pago disponible para el metodo de pago seleccionado
   */
  public getTiempoPagos() {
    return this.http.get(this.endpointService.getEndpoint + 'ibe/configuracion/empresa/efectivo_web/');
  }

  public getViajes(documento: string, orden: string) {
    return this.http.get(this.endpointService.getEndpoint + `consultrar/tiquete/${documento}/${orden}/`);
  }

  public getViajesAuth(token: string) {
    return this.http.get(this.endpointService.getEndpoint + 'consultrar/tiquete/', {
      headers: {
        Authorization: `Token ${token}`
      },
    });
  }

  public getMetodosPago() {
    const metodosPago: MetodoPago[] = [
      {
        nombre: 'Apostar',
        nombreApi: 'apostar',
        imagen: 'assets/images/metodos-pago/apostar.png',
        prontoPago: false,
      },
      // {
      //   nombre: 'Bancolombia',
      //   nombreApi: 'bancolombia',
      //   imagen: 'assets/images/metodos-pago/bancolombia.png',
      //   prontoPago: false,
      // },
      {
        nombre: 'Dimonex',
        nombreApi: 'efecty',
        imagen: 'assets/images/metodos-pago/dimonex.png',
        prontoPago: false,
      },
      {
        nombre: 'Efecty',
        nombreApi: 'efecty',
        imagen: 'assets/images/metodos-pago/efecty.png',
        prontoPago: false,
      },
      {
        nombre: 'GANA',
        nombreApi: 'gana',
        imagen: 'assets/images/metodos-pago/gana.png',
        prontoPago: false,
      },
      {
        nombre: 'Nequi',
        nombreApi: 'nequi',
        imagen: 'assets/images/metodos-pago/nequi.png',
        prontoPago: false,
      },
      {
        nombre: 'Payvalida Colombia',
        nombreApi: 'payvalida',
        imagen: 'assets/images/metodos-pago/payvalida.png',
        prontoPago: false,
      },
      {
        nombre: 'PSE',
        nombreApi: 'pse',
        imagen: 'assets/images/metodos-pago/pse.png',
        prontoPago: true,
      },
      {
        nombre: 'PuntoRed',
        nombreApi: 'puntored',
        imagen: 'assets/images/metodos-pago/puntored.png',
        prontoPago: false,
      },
      {
        nombre: 'RedServi',
        nombreApi: 'redservi',
        imagen: 'assets/images/metodos-pago/redservi.png',
        prontoPago: false,
      },
      {
        nombre: 'SuRed',
        nombreApi: 'sured',
        imagen: 'assets/images/metodos-pago/sured.png',
        prontoPago: false,
      },
      {
        nombre: 'SuSuerte',
        nombreApi: 'susuerte',
        imagen: 'assets/images/metodos-pago/susuerte.png',
        prontoPago: false,
      },
      {
        nombre: 'Tarjeta de crédito',
        nombreApi: 'tc',
        imagen: 'assets/images/metodos-pago/tc1.png',
        prontoPago: true,
      },
      {
        nombre: 'Vía Baloto',
        nombreApi: 'baloto',
        imagen: 'assets/images/metodos-pago/baloto.png',
        prontoPago: false,
      },
    ];
    return metodosPago;
    // return this.http.get(this.endpointService.getEndpoint + `ibe/configuracion/empresa/metodos_pago/?fecha=${fecha}`);
  }
}
