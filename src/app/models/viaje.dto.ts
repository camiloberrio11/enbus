import { Pasajero } from './pasajero.dto'

/// Modelo para manejo de la información de viajes consultados por el usuario
export class Viaje {
    id: number;
    fecha_viaje: string;
    hora_viaje: string;
    pasajero: {
        nombre: string;
        documento: string;
        tipo_documento: string;
        telefono: string;
        correo: string;
    };
    ruta: {
        origen: string;
        destino: string;
    };
    puesto: string;
    pv_payment: string;
    pv_status: string;
    reserva: string;
    valor: number;
    estado: boolean;
}
