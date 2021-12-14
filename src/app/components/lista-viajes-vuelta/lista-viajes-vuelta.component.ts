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
  selector: 'app-lista-viajes-vuelta',
  templateUrl: './lista-viajes-vuelta.component.html',
  styleUrls: ['./lista-viajes-vuelta.component.css']
})
/// Componente dedicado para la página de lista de viajes de vuelta
/// Se encarga de mostrar la información de los viajes de vuelta y
/// la información del viaje seleccionado
export class ListaViajesVueltaComponent implements OnInit {
  labelsSeats = [
    { label: 'Disponible', class: 'disponible' },
    { label: 'Ocupado', class: 'ocupado' },
    { label: 'Seleccionado', class: 'select' },
  ];
  isMobileResolution: boolean;
  listaViajesVisible: boolean;
  seatMapVisible: boolean;
  resumenVisible: boolean;

  cargandoCuentas = false;

  rutas: Route[] = [];
  cuentasVuelta: Cobro[] = [];

  miSeatmap: any[] = [];
  arrayPuestos: Puesto[] = [];

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
    private enbusService: EnbusService,
    private endopointService: EndpointService,
    // private globals: Globals,
    public globals: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
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

    // if (this.route.snapshot.queryParams.origen != null) {
    //   localStorage.setItem('origen', this.route.snapshot.queryParams.origen);
    // }
    // if (this.route.snapshot.queryParams.destino != null) {
    //   localStorage.setItem('destino', this.route.snapshot.queryParams.destino);
    // }
    // if (this.route.snapshot.queryParams.fecha != null) {
    //   localStorage.setItem('fechaVuelta', this.route.snapshot.queryParams.fecha);
    // }

    if (
      localStorage.getItem('origen') != null &&
      localStorage.getItem('destino') != null &&
      // localStorage.getItem('cantidad') != null &&
      localStorage.getItem('fechaIda') != null &&
      localStorage.getItem('fechaVuelta') != null
    ) {
      this.globals.origen = localStorage.getItem('origen');
      this.globals.destino = localStorage.getItem('destino');
      // this.globals.cantidad = Number(localStorage.getItem('cantidad'));
      this.globals.fechaIda = localStorage.getItem('fechaIda');
      this.globals.fechaVuelta = localStorage.getItem('fechaVuelta');
      this.globals.totalCompraVuelta = localStorage.getItem('totalCompraVuelta');
    }

    if (localStorage.getItem('rutaVuelta') != null) {
      this.globals.rutaVuelta = JSON.parse(localStorage.getItem('rutaVuelta'));
      console.log(this.globals.rutaVuelta);
      this.rutaSeleccionada = this.globals.rutaVuelta;
      console.log('ruta seleccionada', this.rutaSeleccionada);
      this.llenarMapa();
    }

    if (localStorage.getItem('asientosSeleccionadosVuelta') != null) {
      this.globals.asientosSeleccionadosVuelta = JSON.parse(localStorage.getItem('asientosSeleccionadosVuelta'));
    }

    if (this.globals.origen == null || this.globals.destino == null || this.globals.fechaVuelta == null) {
      /// Validación de formulario diligenciado
      this.formularioInicio();
    } else {
      /// Hace la petición de lista de viajes de vuelta
      this.enbusService.getAvailability(this.globals.destino, this.globals.origen, this.globals.fechaVuelta).subscribe(vuel => {
        this.rutas = vuel.data;
        this.rutas = this.rutas.sort((a, b) => {
          const time1 = parseFloat(
            a.hora.replace(':', '.').replace(/[^\d.-]/g, '')
          );
          const time2 = parseFloat(
            b.hora.replace(':', '.').replace(/[^\d.-]/g, '')
          );
          if (a.hora.match(/.*pm/)) time1 += 12;
          if (b.hora.match(/.*pm/)) time2 += 12;
          if (time1 < time2) return -1;
          if (time1 > time2) return 1;
          return 0;
        });
      });

      /// Carga la información inicial del resumen de compra con los datos del viaje de ida
      // tslint:disable-next-line: max-line-length
      const value: number = (Number(this.globals.rutaIda.precio_primera_clase) * this.globals.asientosSeleccionadosIda.length);
      this.dataService.getCobros(value.toString()).subscribe(dataCobro => {
        this.cuentasVuelta = [];
        let resp;
        resp = dataCobro;
        resp.forEach(cobro => {
          this.cuentasVuelta.push({ nombre: cobro.nombre, mensaje: cobro.mensaje, valor: cobro.valor });
        });
        const total = this.cuentasVuelta.find(dato => (dato.nombre === 'Total'));
        this.globals.totalCompraVuelta = total.valor.toString();
      });
    }
  }

  formularioInicio() {
    Swal.fire({
      allowOutsideClick: false,
      showCloseButton: true,
      icon: 'error',
      title: 'Primero debes llenar el formulario de inicio',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('/login');
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  /// Metodo para guardar la información de viaje de vuelta y navegar a la próxima pantalla
  onSubmit() {
    if (this.asientosSeleccionados.length === this.globals.asientosSeleccionadosIda.length) {
      this.router.navigateByUrl('/datos-pasajero');
    } else {
      Swal.fire({
        allowOutsideClick: false,
        showCloseButton: true,
        icon: 'warning',
        title: 'Asientos incompletos',
        text: 'Debes seleccionar el mismo numero de asientos seleccionados anteriormente',
      });
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

  /// Metodo para mostrar la información del resumen de viaje y de compra
  public mostrarResumen() {
    if (this.isMobileResolution === true) {
      this.listaViajesVisible = false;
      this.seatMapVisible = false;
      this.resumenVisible = true;
    }
  }

  /// Metodo para guardar la información del viaje seleccionado
  public seleccionarViaje(ruta: Route) {
    this.mostrarSeatMap();

    this.valorTotal = 0;

    this.asientosSeleccionados = [];
    this.asientosReservados = [];

    this.globals.asientosSeleccionadosVuelta = [];
    localStorage.setItem('asientosSeleccionadosVuelta', JSON.stringify(this.globals.asientosSeleccionadosVuelta));

    this.globals.rutaVuelta = ruta;
    this.rutaSeleccionada = ruta;

    localStorage.setItem('rutaVuelta', JSON.stringify(this.globals.rutaVuelta));

    this.miSeatmap = [];

    /// llenado de mapa de asientos
    this.llenarMapa();

    /// Suscripción a las notificaciones de estado de asientos
    this.websocketsService.subToTrip(ruta.id.toString() + 'FLOTAOSPINA').subscribe(
      msg => {
        const estado = msg;
        this.editarAsiento(estado.seat, estado.status);
      },
      err => { },
      () => { }
    );
  }

  /// Metodo ejecutado al seleccionar un asiento
  public seleccionAsiento(puesto: Puesto) {
    const flag = this.asientosSeleccionados.some(asiento => asiento.numero === puesto.numero);
    this.cargandoCuentas = true;

    if (flag === false) {
      if (this.asientosSeleccionados.length < this.globals.asientosSeleccionadosIda.length) {
        this.websocketsService.tripReservation(this.globals.rutaVuelta.id.toString(), puesto.numero, 'S');
        this.asientosSeleccionados.push(puesto);
        this.miSeatmap.forEach(fila => {
          fila.forEach(asiento => {
            if (asiento.numero === puesto.numero && (asiento.estado !== '_' || asiento.estado !== 'O')) {
              asiento.estado = 'a';
            }
          });
        });
      }
    } else {
      this.websocketsService.tripReservation(this.globals.rutaVuelta.id.toString(), puesto.numero, 'D');
      this.miSeatmap.forEach(fila => {
        fila.forEach(asiento => {
          if (asiento.numero === puesto.numero && (asiento.estado !== '_' || asiento.estado !== 'O')) {
            asiento.estado = 'f';
          }
        });
      });
      this.asientosSeleccionados = this.asientosSeleccionados.filter(asiento => (asiento.numero !== puesto.numero));
    }
    this.globals.asientosSeleccionadosVuelta = this.asientosSeleccionados;
    localStorage.setItem('asientosSeleccionadosVuelta', JSON.stringify(this.globals.asientosSeleccionadosVuelta));
    // tslint:disable-next-line: radix
    this.valorTotal = parseInt(this.globals.rutaVuelta.precio_primera_clase) * this.asientosSeleccionados.length;

    if (this.asientosSeleccionados.length > 0) {
      // tslint:disable-next-line: max-line-length
      const value: number = ((Number(this.globals.rutaIda.precio_primera_clase) * this.globals.asientosSeleccionadosIda.length) + (this.asientosSeleccionados.length * Number(this.globals.rutaVuelta.precio_primera_clase)));
      /// Hace petición de lista de cobros con los asientos seleccionados
      this.dataService.getCobros(value.toString()).subscribe(dataCobro => {
        this.cuentasVuelta = [];
        let resp;
        resp = dataCobro;
        resp.forEach(cobro => {
          this.cuentasVuelta.push({ nombre: cobro.nombre, mensaje: cobro.mensaje, valor: cobro.valor });
        });
        const total = this.cuentasVuelta.find(dato => (dato.nombre === 'Total'));
        this.globals.totalCompraVuelta = total.valor.toString();
      });
    } else {
      // tslint:disable-next-line: max-line-length
      const value: number = (Number(this.globals.rutaIda.precio_primera_clase) * this.globals.asientosSeleccionadosIda.length);
      /// Hace petición de lista de cobros con los asientos seleccionados
      this.dataService.getCobros(value.toString()).subscribe(dataCobro => {
        this.cuentasVuelta = [];
        let resp;
        resp = dataCobro;
        resp.forEach(cobro => {
          this.cuentasVuelta.push({ nombre: cobro.nombre, mensaje: cobro.mensaje, valor: cobro.valor });
        });
        const total = this.cuentasVuelta.find(dato => (dato.nombre === 'Total'));
        this.globals.totalCompraVuelta = total.valor.toString();
      });
    }
    this.cargandoCuentas = false;
  }

  /// Metodo ejecutado al recibir mensaje del servidor sobre estado de un asiento
  public editarAsiento(numero: string, estado: string) {
    if (numero != null && estado != null) {
      const flag = this.asientosSeleccionados.some(asiento => asiento.numero === numero);
      if (!flag) {
        let indexPuesto;
        // tslint:disable-next-line: prefer-for-of
        for (let indexFila = 0; indexFila < this.miSeatmap.length; indexFila++) {

          const puestoACambiar = this.miSeatmap[indexFila].find((item, i) => {
            if (item.numero === numero) {
              indexPuesto = i;
              return item;
            }
          });
          if (puestoACambiar) {
            const puestoNuevo: Puesto = { numero, estado, consecutivo: puestoACambiar.consecutivo };
            this.miSeatmap[indexFila][indexPuesto] = puestoNuevo;
            break;
          }
        }
      }
    }
  }

  public llenarMapa() {
    let consecutivo = 0;
    let numero = 1;

    this.globals.rutaVuelta.mapa_asientos_primero.split(',').forEach(stringFila => {
      const listaFila: Puesto[] = [];

      stringFila.split('').forEach(stringAsiento => {
        if (stringAsiento !== '_') {
          if (
            this.globals.rutaVuelta.ocupado != null &&
            this.globals.rutaVuelta.ocupado.length > 0 &&
            this.globals.rutaVuelta.ocupado.includes(numero.toString())
          ) {
            listaFila.push({ consecutivo: consecutivo.toString(), numero: numero.toString(), estado: 'O' });
          } else {
            listaFila.push({ consecutivo: consecutivo.toString(), numero: numero.toString(), estado: stringAsiento });
          }
          numero++;
        } else {
          listaFila.push({ consecutivo: consecutivo.toString(), numero: '0', estado: stringAsiento });
        }
        consecutivo++;
      });
      this.miSeatmap.push(listaFila);
    });
  }

  /// Metodo para cambiar de piso en el mapa de asientos
  public togglePiso(piso: number) {
    this.piso = piso;
  }
}
