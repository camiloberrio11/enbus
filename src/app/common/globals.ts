import { Injectable } from '@angular/core';
import { Route } from '../models/route.dto';
import { Puesto } from '../models/puesto.dto';
import { Payment } from '../models/payment.dto';
import { Usuario } from '../models/usuario.dto';

@Injectable()
/// Clase para manejo de datos globales dentro de la aplicación
export class Globals {

    origen: string;
    destino: string;
    cantidad: number;
    fechaIda: string;
    fechaVuelta: string;
    asientosSeleccionadosIda: Puesto[];
    asientosSeleccionadosVuelta: Puesto[];
    rutaIda: Route;
    rutaVuelta: Route;
    totalCompraIda: string;
    totalCompraVuelta: string;
    datosCompra: Payment;
    usuario: Usuario;
}
