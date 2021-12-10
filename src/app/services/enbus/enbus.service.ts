import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DisponibilidadRuta } from 'src/app/models/Trayectos.enbus';

@Injectable({
  providedIn: 'root',
})
export class EnbusService {
  constructor(private readonly http: HttpClient) {}

  getOrigins(): Observable<any> {
    return this.http.get(`${environment.urlEnBus}/origenes`);
  }

  getFechaMaxima(
    origin: string,
    departure: string,
    dateOutbound: string
  ): Observable<any> {
    return this.http.get(
      `${environment.urlEnBus}/fecha_maxima?origin=${origin}&destination=${departure}&date=${dateOutbound}`
    );
  }

  getDeparture(origin: string): Observable<any> {
    return this.http.get(`${environment.urlEnBus}/destinos?origen=${origin}`);
  }

  getAvailability(
    origin: string,
    departure: string,
    dateOutbound: string
  ): Observable<DisponibilidadRuta> {
    return this.http.get<DisponibilidadRuta>(
      `${environment.urlEnBus}/viajes?origin=${origin}&destination=${departure}&date=${dateOutbound}`
    );
  }
}
