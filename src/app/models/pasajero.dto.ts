/// Modelo para manejar la información de los pasajeros
export class Pasajero {
    nombre: string;
    apellidos: string;
    documento: string;
    telefono: string;
    correo: string;
    tipo_documento: string;
    puesto_ida: string;
    puesto_vuelta?: string;
    clase_ida: string;
    clase_vuelta?: string;
}