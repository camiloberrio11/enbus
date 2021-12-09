import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  constructor() { }

  private endpointLocal = 'http://localhost:8000/api/';
  private endpointIbePruebas = 'https://bts2.metis.com.co/api/';
  private endpointIbeProduccion = 'https://flotaospina.metis.com.co/api/';

  private endpointActual = this.endpointIbePruebas;

  public get getEndpoint(): string {
    return this.endpointActual;
  }

}
