import { EndpointService } from './../../services/endpoint/endpoint.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { WebsocketsService } from '../../services/websockets/websockets.service';
import { DataService } from '../../services/data/data.service';
// import { Globals } from '../../common/globals';
import { Route } from '../../models/route.dto';
import { Puesto } from '../../models/puesto.dto';
import { Cobro } from '../../models/cuenta.dto';
import { GlobalService } from 'src/app/services/global/global.service';

import { ActivatedRoute } from '@angular/router';
import { EnbusService } from 'src/app/services/enbus/enbus.service';

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.component.html',
  styleUrls: ['./lista-viajes.component.css'],
})
/// Componente dedicado para la página de lista de viajes de ida
/// Se encarga de mostrar la información de los viajes de ida y
/// la información del viaje seleccionado
export class ListaViajesComponent implements OnInit {
  isMobileResolution: boolean;
  listaViajesVisible: boolean;
  seatMapVisible: boolean;
  resumenVisible: boolean;
  viajeVuelta: boolean;
  cargandoCuentas = false;

  rutas: Route[] = [];
  cuentas: Cobro[] = [];

  miSeatmap: any[] = [];

  asientosSeleccionados: Puesto[] = [];
  asientosReservados: Puesto[] = [];

  valorTotal = 0;
  piso = 1;

  rutaSeleccionada: Route = {
    id: null,
    origen: '',
    destino: '',
    hora: '',
    fecha: '',
    precio_primera_clase: '',
    precio_segunda_clase: '',
    mapa_asientos_primero: '',
    mapa_asientos_segundo: '',
    empresa: '',
    tipo_vehiculo: '',
    imagen_ruta: '',
    logo_empresa: '',
    disponible: '',
    ocupado: [],
  };

  constructor(
    private websocketsService: WebsocketsService,
    private dataService: DataService,
    // private globals: Globals,
    private readonly enbusService: EnbusService,
    private endpointService: EndpointService,
    public globals: GlobalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (window.innerWidth <= 1024) {
      this.isMobileResolution = true;
      this.listaViajesVisible = true;
      this.seatMapVisible = false;
      this.resumenVisible = false;
    } else {
      this.isMobileResolution = false;
      this.listaViajesVisible = true;
      this.seatMapVisible = true;
      this.resumenVisible = true;
    }
  }

  /// Metodo ejecutado en el inicio, hace las peticiones al servidor
  ngOnInit() {
    if (this.route.snapshot.queryParams.origen != null) {
      localStorage.setItem('origen', this.route.snapshot.queryParams.origen);
    }
    if (this.route.snapshot.queryParams.destino != null) {
      localStorage.setItem('destino', this.route.snapshot.queryParams.destino);
    }
    if (this.route.snapshot.queryParams.fecha != null) {
      localStorage.setItem('fechaIda', this.route.snapshot.queryParams.fecha);
    }

    if (
      localStorage.getItem('origen') != null &&
      localStorage.getItem('destino') != null &&
      localStorage.getItem('cantidad') != null &&
      localStorage.getItem('fechaIda') != null
    ) {
      this.globals.origen = localStorage.getItem('origen');
      this.globals.destino = localStorage.getItem('destino');
      this.globals.fechaIda = localStorage.getItem('fechaIda');
      this.globals.totalCompraIda = localStorage.getItem('totalCompraIda');
    }

    if (
      localStorage.getItem('fechaVuelta') != null &&
      localStorage.getItem('fechaVuelta') !== 'null'
    ) {
      this.globals.fechaVuelta = localStorage.getItem('fechaVuelta');
    }

    if (localStorage.getItem('rutaIda') != null) {
      this.globals.rutaIda = JSON.parse(localStorage.getItem('rutaIda'));
      console.log(this.globals.rutaIda);
      this.rutaSeleccionada = this.globals.rutaIda;
      console.log('ruta seleccionada', this.rutaSeleccionada);
      this.llenarMapa();
    }

    if (localStorage.getItem('asientosSeleccionadosIda') != null) {
      this.globals.asientosSeleccionadosIda = JSON.parse(
        localStorage.getItem('asientosSeleccionadosIda')
      );
    }
    console.log('ida1', this.globals.fechaIda);
    console.log('vuelta1', this.globals.fechaVuelta);
    if (this.globals.fechaVuelta != null) {
      this.viajeVuelta = true;
    } else {
      this.viajeVuelta = false;
    }

    // console.log(this.globals.rutaIda.mapa_asientos_primero);

    if (
      this.globals.origen == null ||
      this.globals.destino == null ||
      this.globals.fechaIda == null
    ) {
      /// Validación de formulario diligenciado
      this.formularioInicio();
    } else {
      /// Hace la petición de lista de viajes de ida
      this.enbusService
        .getAvailability(
          this.globals.origen,
          this.globals.destino,
          this.globals.fechaIda
        )
        .subscribe(
          (ida) => {
            this.rutas = ida.data;
          },
          (err) => {}
        );

      // this.dataService
      //   .getEnrutamientos(
      //     this.globals.origen,
      //     this.globals.destino,
      //     this.globals.fechaIda
      //   )
      //   .subscribe(
      //     (dataRutas) => {
      //       let resp;
      //       resp = dataRutas;
      //       resp.forEach((ruta) => {
      //         this.rutas.push(ruta);
      //       });
      //     },
      //     (err) => {}
      //   );
    }
  }

  /// Metodo para guardar la información de viaje de ida y navegar a la próxima pantalla
  onSubmit() {
    if (this.asientosSeleccionados.length === 0) {
      Swal.fire({
        allowOutsideClick: false,
        showCloseButton: true,
        icon: 'warning',
        title: 'Asientos incompletos',
        text: 'Debes seleccionar asientos para continuar',
      });
    } else if (this.globals.fechaVuelta != null) {
      this.globals.cantidad = this.asientosSeleccionados.length;
      // tslint:disable-next-line: max-line-length
      this.router.navigateByUrl(
        `/lista-viajes-vuelta/?origen=${this.globals.destino}&destino=${this.globals.origen}&fecha=${this.globals.fechaVuelta}`
      );
    } else {
      this.router.navigateByUrl('/datos-pasajero');
    }
  }

  /// Metodo para mostrar la información de los viajes disponibles
  public mostrarViajes() {
    if (this.isMobileResolution === true) {
      this.listaViajesVisible = true;
      this.seatMapVisible = false;
      this.resumenVisible = false;
    }
  }

  /// Metodo para mostrar la información del mapa de asientos
  public mostrarSeatMap() {
    if (this.isMobileResolution === true) {
      this.listaViajesVisible = false;
      this.seatMapVisible = true;
      this.resumenVisible = false;
    }
  }

  /// Metodo para mostrar la información del resumen de viaje y/o del resumen de compra
  public mostrarResumen() {
    if (this.isMobileResolution === true) {
      this.listaViajesVisible = false;
      this.seatMapVisible = false;
      this.resumenVisible = true;
    }
  }

  /// Metodo para guardar la información del viaje seleccionado
  public seleccionarViaje(ruta: Route) {
    this.endpointService.setEndpoint(`https://${ruta.host}/api/`);
    this.mostrarSeatMap();
    this.valorTotal = 0;
    this.asientosSeleccionados = [];
    this.asientosReservados = [];
    this.globals.asientosSeleccionadosIda = [];
    localStorage.setItem(
      'asientosSeleccionadosIda',
      JSON.stringify(this.globals.asientosSeleccionadosIda)
    );

    this.globals.rutaIda = ruta;
    this.rutaSeleccionada = ruta;

    localStorage.setItem('rutaIda', JSON.stringify(this.globals.rutaIda));

    this.miSeatmap = [];

    /// llenado de mapa de asientos
    this.llenarMapa();

    /// Suscripción a las notificaciones de estado de asientos
    this.websocketsService
      .subToTrip(ruta.id.toString() + 'FLOTAOSPINA')
      .subscribe(
        (msg) => {
          const estado = msg;
          this.editarAsiento(estado.seat, estado.status);
        },
        (err) => {},
        () => {}
      );
  }

  llenarMapa() {
    let consecutivo = 0;
    let numero = 1;

    this.globals.rutaIda.mapa_asientos_primero
      .split(',')
      .forEach((stringFila) => {
        // tslint:disable-next-line: prefer-const
        let listaFila: Puesto[] = [];

        stringFila.split('').forEach((stringAsiento) => {
          if (stringAsiento !== '_') {
            if (
              this.globals.rutaIda.ocupado != null &&
              this.globals.rutaIda.ocupado.length > 0 &&
              this.globals.rutaIda.ocupado.includes(numero.toString())
            ) {
              listaFila.push({
                consecutivo: consecutivo.toString(),
                numero: numero.toString(),
                estado: 'O',
              });
            } else {
              listaFila.push({
                consecutivo: consecutivo.toString(),
                numero: numero.toString(),
                estado: stringAsiento,
              });
            }
            numero++;
          } else {
            listaFila.push({
              consecutivo: consecutivo.toString(),
              numero: '0',
              estado: stringAsiento,
            });
          }
          consecutivo++;
        });

        this.miSeatmap.push(listaFila);
      });
  }

  /// Metodo ejecutado al seleccionar un asiento
  public seleccionAsiento(puesto: Puesto) {
    const flag = this.asientosSeleccionados.some(
      (asiento) => asiento.numero === puesto.numero
    );
    this.cargandoCuentas = true;

    if (flag === false) {
      // if (this.asientosSeleccionados.length < Number(this.globals.cantidad)) {
      this.websocketsService.tripReservation(
        this.globals.rutaIda.id.toString(),
        puesto.numero,
        'S'
      );
      this.asientosSeleccionados.push(puesto);
      this.miSeatmap.forEach((fila) => {
        fila.forEach((asiento) => {
          if (
            asiento.numero === puesto.numero &&
            (asiento.estado !== '_' || asiento.estado !== 'O')
          ) {
            asiento.estado = 'a';
          }
        });
      });
      // }
    } else {
      this.websocketsService.tripReservation(
        this.globals.rutaIda.id.toString(),
        puesto.numero,
        'D'
      );
      this.miSeatmap.forEach((fila) => {
        fila.forEach((asiento) => {
          if (
            asiento.numero === puesto.numero &&
            (asiento.estado !== '_' || asiento.estado !== 'O')
          ) {
            asiento.estado = 'f';
          }
        });
      });
      this.asientosSeleccionados = this.asientosSeleccionados.filter(
        (asiento) => asiento.numero !== puesto.numero
      );
    }
    this.globals.asientosSeleccionadosIda = this.asientosSeleccionados;
    localStorage.setItem(
      'asientosSeleccionadosIda',
      JSON.stringify(this.globals.asientosSeleccionadosIda)
    );
    // tslint:disable-next-line: radix
    this.valorTotal =
      parseInt(this.globals.rutaIda.precio_primera_clase) *
      this.asientosSeleccionados.length;

    const value: number =
      this.asientosSeleccionados.length *
      Number(this.globals.rutaIda.precio_primera_clase);
    if (this.asientosSeleccionados.length > 0) {
      /// Hace petición de lista de cobros con los asientos seleccionados
      this.dataService.getCobros(value.toString()).subscribe((dataCobro) => {
        this.cuentas = [];
        let resp;
        resp = dataCobro;
        resp.forEach((cobro) => {
          this.cuentas.push({
            nombre: cobro.nombre,
            mensaje: cobro.mensaje,
            valor: cobro.valor,
          });
        });
        const total = this.cuentas.find((dato) => dato.nombre === 'Total');
        this.globals.totalCompraIda = total.valor.toString();
      });
    }
    this.cargandoCuentas = false;
  }

  /// Metodo ejecutado al recibir mensaje del servidor sobre estado de un asiento
  public editarAsiento(numero: string, estado: string) {
    if (numero != null && estado != null) {
      const flag = this.asientosSeleccionados.some(
        (asiento) => asiento.numero === numero
      );
      if (!flag) {
        let indexPuesto;
        // tslint:disable-next-line: prefer-for-of
        for (
          let indexFila = 0;
          indexFila < this.miSeatmap.length;
          indexFila++
        ) {
          const puestoACambiar = this.miSeatmap[indexFila].find((item, i) => {
            if (item.numero === numero) {
              indexPuesto = i;
              return item;
            }
          });
          if (puestoACambiar) {
            const puestoNuevo: Puesto = {
              numero,
              estado,
              consecutivo: puestoACambiar.consecutivo,
            };
            this.miSeatmap[indexFila][indexPuesto] = puestoNuevo;
            break;
          }
        }
      }
    }
  }

  formularioInicio() {
    Swal.fire({
      allowOutsideClick: false,
      showCloseButton: true,
      icon: 'error',
      title: 'Primero debes llenar el formulario de inicio',
      onClose: () => this.router.navigateByUrl('/'),
    });
  }

  /// Metodo para cambiar de piso en el mapa de asientos
  public togglePiso(piso: number) {
    this.piso = piso;
  }
}
