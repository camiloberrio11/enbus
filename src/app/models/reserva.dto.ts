import { Pasajero } from './pasajero.dto';
import { Comprador } from './comprador.dto';
/// Modelo para manejar la comunicación con los datos de compra
export class Reserva {
    pasajeros: Pasajero[];
    enrutamiento_ida: number;
    enrutamiento_vuelta?: number;
    fecha_compra: string;
    metodo_pago: string;
    comprador: Comprador;
    cupon: string;
}
