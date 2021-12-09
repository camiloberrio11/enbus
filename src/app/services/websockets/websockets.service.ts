import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
/// Servicio para manejo de websockets
export class WebsocketsService {

  endpoint = 'wss://aw4ec7evu8.execute-api.us-west-2.amazonaws.com/prod/';

  constructor() { }

  /// Metodo de suscripción a los eventos de modificación de asientos de un vehículo
  subToTrip(tripId: string): WebSocketSubject<any> {
    const subject = webSocket(this.endpoint);
    subject.next({ action: 'subscribetotrip', data: { trip_id: tripId } });
    return subject;
  }

  /// Metodo para editar el estado de la silla de un vehículo
  public tripReservation(tripId: string, asiento: string, estado: string) {
    const subject = webSocket(this.endpoint);
    subject.next({ action: 'tripreservation', data: { trip_id: tripId + 'FLOTAOSPINA', seat: asiento, status: estado } });
    subject.subscribe(
      msg => { subject.complete(); },
      err => { subject.complete(); },
      () => { }
    );
  }
}
