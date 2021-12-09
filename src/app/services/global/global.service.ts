import { Injectable } from '@angular/core';
import { Globals } from 'src/app/common/globals';
import { Puesto } from 'src/app/models/puesto.dto';
import { Route } from 'src/app/models/route.dto';
import { Payment } from 'src/app/models/payment.dto';
import { Usuario } from 'src/app/models/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    private myGlobals: Globals,
  ) { }


  public get origen(): string {
    return this.myGlobals.origen;
  }

  public set origen(value: string) {
    this.myGlobals.origen = value;
  }

  public get destino(): string {
    return this.myGlobals.destino;
  }

  public set destino(value: string) {
    this.myGlobals.destino = value;
  }

  public get cantidad(): number {
    return this.myGlobals.cantidad;
  }

  public set cantidad(value: number) {
    this.myGlobals.cantidad = value;
  }

  public get fechaIda(): string {
    return this.myGlobals.fechaIda;
  }

  public set fechaIda(value: string) {
    this.myGlobals.fechaIda = value;
  }

  public get fechaVuelta(): string {
    return this.myGlobals.fechaVuelta;
  }

  public set fechaVuelta(value: string) {
    this.myGlobals.fechaVuelta = value;
  }

  public get asientosSeleccionadosIda(): Puesto[] {
    return this.myGlobals.asientosSeleccionadosIda;
  }

  public set asientosSeleccionadosIda(value: Puesto[]) {
    this.myGlobals.asientosSeleccionadosIda = value;
  }

  public get asientosSeleccionadosVuelta(): Puesto[] {
    return this.myGlobals.asientosSeleccionadosVuelta;
  }

  public set asientosSeleccionadosVuelta(value: Puesto[]) {
    this.myGlobals.asientosSeleccionadosVuelta = value;
  }

  public get rutaIda(): Route {
    return this.myGlobals.rutaIda;
  }

  public set rutaIda(value: Route) {
    this.myGlobals.rutaIda = value;
  }

  public get rutaVuelta(): Route {
    return this.myGlobals.rutaVuelta;
  }

  public set rutaVuelta(value: Route) {
    this.myGlobals.rutaVuelta = value;
  }

  public get totalCompraIda(): string {
    return this.myGlobals.totalCompraIda;
  }

  public set totalCompraIda(value: string) {
    this.myGlobals.totalCompraIda = value;
  }

  public get totalCompraVuelta(): string {
    return this.myGlobals.totalCompraVuelta;
  }

  public set totalCompraVuelta(value: string) {
    this.myGlobals.totalCompraVuelta = value;
  }

  public get datosCompra(): Payment {
    return this.myGlobals.datosCompra;
  }

  public set datosCompra(value: Payment) {
    this.myGlobals.datosCompra = value;
  }

  public get usuario(): Usuario {
    return this.myGlobals.usuario;
  }

  public set usuario(value: Usuario) {
    this.myGlobals.usuario = value;
  }
}
