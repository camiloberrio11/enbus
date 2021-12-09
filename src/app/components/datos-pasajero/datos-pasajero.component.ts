import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { WebsocketsService } from '../../services/websockets/websockets.service';
import { DataService } from '../../services/data/data.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Puesto } from '../../models/puesto.dto';
import { Pasajero } from '../../models/pasajero.dto';
import { Reserva } from 'src/app/models/reserva.dto';
import { Cobro } from 'src/app/models/cuenta.dto';
import { GlobalService } from 'src/app/services/global/global.service';
import { Usuario } from 'src/app/models/usuario.dto';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Comprador } from 'src/app/models/comprador.dto';

interface Field {
  name: string;
  label?: string;
  control?: FormControl;
  type: string;
  data?: any;
}

interface Client {
  name: string;
  index: string;
  label?: string;
  fields: Field[];
  control?: FormGroup;
}

@Component({
  selector: 'app-datos-pasajero',
  templateUrl: './datos-pasajero.component.html',
  styleUrls: ['./datos-pasajero.component.css']
})
/**
 * Componente dedicado para la página de registro de datos de los pasajeros,
 * datos de compra y reserva de tiquetes
 * Se encarga de pedir los datos de los pasajeros que viaja,
 * los datos de pago y de enviar la información suministrada al servidor
 */
export class DatosPasajeroComponent implements OnInit {

  asientos: Puesto[] = [];
  pasajeros: Pasajero[] = [];
  metodoPago: string;
  fechaViajeIda;
  tiempoMayor;
  cuentas: Cobro[] = [];
  disabledButton = false;
  valor: number;

  public myForm: FormGroup = new FormGroup({});
  private clientCount = 1;
  /**
   * Metodos de pago disponibles
   */
  public mediosDePago = [];

  /**
   * Tipos de documento disponibles
   */
  public docType = [
    {
      value: 'CC',
      text: 'Cédula de ciudadanía',
    },
    {
      value: 'CE',
      text: 'Cédula de extranjería',
    },
    {
      value: 'TI',
      text: 'Tarjeta de identificación',
    },
    {
      value: 'PA',
      text: 'Pasaporte',
    },
    {
      value: 'RC',
      text: 'Registro civil',
    },
  ];

  clients: Client[] = [];
  isAuth = false;
  authUser: Usuario;
  checkNuevo = false;
  checkLogin = false;
  datosPago = false;

  formAutocomplete = new FormGroup({
    autocomplete: new FormControl(''),
  });

  formDescuento = this.formBuilder.group({
    cupon: [''],
  });

  formRegistro = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  formLogin = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  formChecks = this.formBuilder.group({
    centroLogistica: ['', Validators.required],
    decretos: ['', Validators.required],
    soportes: ['', Validators.required],
    tycCovid: ['', Validators.required],
  });

  formPago = this.formBuilder.group({
    tipodoc: ['', Validators.required],
    numerodoc: ['', Validators.required],
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', Validators.required],
    checkNuevo: [false],
  });

  formMetodosPago = this.formBuilder.group({
    metodo: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    public globals: GlobalService,
    private websocketsService: WebsocketsService,
    private dataService: DataService,
    private authService: AuthService,
  ) {
    if (this.globals.origen == null || this.globals.destino == null || this.globals.fechaIda == null) {
      Swal.fire({
        allowOutsideClick: false,
        showCloseButton: true,
        icon: 'error',
        title: 'Primero debes llenar el formulario de inicio',
        onClose: () => this.router.navigateByUrl('/'),
      });
    } else {
      this.fechaViajeIda = moment(this.globals.rutaIda.fecha + ' ' + this.globals.rutaIda.hora, 'DD/MM/YYYY hh:mm');
      this.dataService.getTiempoPagos().subscribe(
        data => {
          let resp;
          resp = data;
          this.tiempoMayor = Number(moment.duration(this.fechaViajeIda.diff(moment())).asHours()) >= Number(resp.valor);
        }
      );

      this.globals.asientosSeleccionadosIda.forEach(asiento => {
        const client: Client = {
          name: 'client' + asiento.numero,
          index: asiento.numero,
          fields: [
            { name: 'type' + asiento.numero, label: 'Tipo de documento', type: 'select', data: this.docType },
            { name: 'document' + asiento.numero, label: 'Documento', type: 'input' },
            { name: 'first_name' + asiento.numero, label: 'Nombre', type: 'input' },
            { name: 'last_name' + asiento.numero, label: 'Apellidos', type: 'input' },
            { name: 'telefono' + asiento.numero, label: 'teléfono', type: 'input' },
            { name: 'email' + asiento.numero, label: 'Correo', type: 'input' },
          ],
        };

        this.clients.push(client);
      });

      this.clients.forEach(client => {
        this.myForm.addControl(client.name, (client.control = this.groupify(client.fields)));
      });
    }

    this.mediosDePago = this.dataService.getMetodosPago();
  }

  ngOnInit() {

    if (localStorage.getItem('usuario') != null) {
      this.globals.usuario = JSON.parse(localStorage.getItem('usuario'));
    }

    if (this.globals.usuario != null) {

      if (this.globals.usuario.first_name != null) {

        this.formAutocomplete.controls.autocomplete.disable();

        this.formPago.controls.nombre.disable();
        this.formPago.controls.apellidos.disable();
        // this.formPago.controls.telefono.disable();
        this.formPago.controls.correo.disable();
        this.formPago.controls.tipodoc.disable();
        this.formPago.controls.numerodoc.disable();
        this.formPago.controls.checkNuevo.disable();

        this.formPago.setValue({
          nombre: this.globals.usuario.first_name,
          apellidos: this.globals.usuario.last_name,
          telefono: this.globals.usuario.telefono,
          correo: this.globals.usuario.email,
          tipodoc: 'CC',
          numerodoc: this.globals.usuario.documento,
          checkNuevo: false,
        });

        this.isAuth = true;
        this.authUser = this.globals.usuario;
        this.datosPago = true;
      }

      if (this.globals.usuario.telefono == null || this.globals.usuario.telefono === '') {
        this.formPago.controls.telefono.enable();
      }
      if (this.globals.usuario.email == null || this.globals.usuario.email === '') {
        this.formPago.controls.correo.enable();
      }
    }
  }

  /**
   * Envío de datos al servidor para realizar proceso de compra
   */
  onSubmit() {
    this.onSubmitPayU();
  }

  onSubmitPayU() {
    this.disabledButton = true;
    this.formPago.controls.nombre.enable();
    this.formPago.controls.apellidos.enable();
    this.formPago.controls.telefono.enable();
    this.formPago.controls.correo.enable();
    this.formPago.controls.tipodoc.enable();
    this.formPago.controls.numerodoc.enable();

    Swal.fire({
      title: '¡Estamos validanto la información!',
      html: 'Por favor espera un momento',
      icon: 'info',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    const pasajeros: Pasajero[] = [];
    this.getFormData().forEach(cliente => {
      if (cliente.tipo === 'i') {
        pasajeros.push({
          clase_ida: 'primera',
          puesto_ida: cliente.asientoIda,
          nombre: cliente.nombre,
          apellidos: cliente.apellidos,
          telefono: cliente.telefono,
          documento: cliente.documento,
          correo: cliente.correo,
          tipo_documento: cliente.tipodoc,
        });
      } else {
        pasajeros.push({
          clase_ida: 'primera',
          clase_vuelta: 'primera',
          puesto_ida: cliente.asientoIda,
          puesto_vuelta: cliente.asientoVuelta,
          nombre: cliente.nombre,
          apellidos: cliente.apellidos,
          telefono: cliente.telefono,
          documento: cliente.documento,
          correo: cliente.correo,
          tipo_documento: cliente.tipodoc,
        });
      }
    });

    let reserva: Reserva;
    if (this.globals.rutaVuelta == null) {

      let comprador: Comprador;

      comprador = {
        nombre: this.formPago.value.nombre,
        apellidos: this.formPago.value.apellidos,
        documento: this.formPago.value.numerodoc,
        correo: this.formPago.value.correo,
        tipo_documento: this.formPago.value.tipodoc,
        telefono: this.formPago.value.telefono,
      };

      console.log(this.formDescuento.value.cupon);

      reserva = {
        comprador,
        enrutamiento_ida: this.globals.rutaIda.id,
        fecha_compra: moment().format('DD/MM/YYYY'),
        metodo_pago: this.metodoPago,
        pasajeros,
        cupon: this.formDescuento.value.cupon,
      };
    } else {

      let comprador: Comprador;

      comprador = {
        tipo_documento: this.formPago.value.tipodoc,
        documento: this.formPago.value.numerodoc,
        nombre: this.formPago.value.nombre,
        apellidos: this.formPago.value.apellidos,
        telefono: this.formPago.value.telefono,
        correo: this.formPago.value.correo,
      };

      reserva = {
        comprador,
        enrutamiento_ida: this.globals.rutaIda.id,
        enrutamiento_vuelta: this.globals.rutaVuelta.id,
        fecha_compra: moment().format('DD/MM/YYYY'),
        metodo_pago: this.metodoPago,
        pasajeros,
        cupon: this.formDescuento.value.cupon,
      };
    }

    this.dataService.reservarTiquetes(reserva).subscribe(
      data => {
        let resp;
        resp = data;

        Swal.fire({
          allowOutsideClick: false,
          showCloseButton: false,
          icon: 'success',
          title: 'Hemos generado tu reserva!',
          text: 'A continuación serás redirigido al sitio de pago.',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.replace(resp.url);
        });

        this.formPago.controls.nombre.disable();
        this.formPago.controls.apellidos.disable();
        this.formPago.controls.telefono.disable();
        this.formPago.controls.correo.disable();
        this.formPago.controls.tipodoc.disable();
        this.formPago.controls.numerodoc.disable();

      },
      err => {

        this.formPago.controls.nombre.enable();
        this.formPago.controls.apellidos.enable();
        this.formPago.controls.telefono.enable();
        this.formPago.controls.correo.enable();
        this.formPago.controls.tipodoc.enable();
        this.formPago.controls.numerodoc.enable();

        this.disabledButton = false;
        let error = err.error;
        console.log(error);
        let mensaje: string;
        let titulo: string;

        let count = 0;
        while (count < 4) {
          for (const key1 in error) {
            if (Object.prototype.hasOwnProperty.call(error, key1)) {
              for (const key2 in error) {
                if (Object.prototype.hasOwnProperty.call(error, key2) && typeof error !== 'string') {
                  const element = error[key2];
                  if (typeof key2 === 'string' && key1.length > 2) {
                    titulo = key2;
                  }
                  mensaje = error[key2];
                }
              }
              error = error[key1];
            }
          }
          count++;
        }

        Swal.fire({
          allowOutsideClick: false,
          showCloseButton: true,
          icon: 'error',
          title: titulo,
          text: mensaje,
          onClose: () => {
            if (titulo.includes('puesto')) {
              if (titulo.includes('ida')) {
                this.router.navigateByUrl('/lista-viajes');
              } else {
                this.router.navigateByUrl('/lista-viajes-vuelta');
              }
            }
          },
        });
      },
    );
  }

  onSubmitPayValida() {

    this.disabledButton = true;
    this.formPago.controls.nombre.enable();
    this.formPago.controls.apellidos.enable();
    this.formPago.controls.telefono.enable();
    this.formPago.controls.correo.enable();
    this.formPago.controls.tipodoc.enable();
    this.formPago.controls.numerodoc.enable();

    Swal.fire({
      title: '¡Estamos validanto la información!',
      html: 'Por favor espera un momento',
      icon: 'info',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    const pasajeros: Pasajero[] = [];
    this.getFormData().forEach(cliente => {
      if (cliente.tipo === 'i') {
        pasajeros.push({
          clase_ida: 'primera',
          puesto_ida: cliente.asientoIda,
          nombre: cliente.nombre,
          apellidos: cliente.apellidos,
          telefono: cliente.telefono,
          documento: cliente.documento,
          correo: cliente.correo,
          tipo_documento: cliente.tipodoc,
        });
      } else {
        pasajeros.push({
          clase_ida: 'primera',
          clase_vuelta: 'primera',
          puesto_ida: cliente.asientoIda,
          puesto_vuelta: cliente.asientoVuelta,
          nombre: cliente.nombre,
          apellidos: cliente.apellidos,
          telefono: cliente.telefono,
          documento: cliente.documento,
          correo: cliente.correo,
          tipo_documento: cliente.tipodoc,
        });
      }
    });

    let reserva: Reserva;
    if (this.globals.rutaVuelta == null) {

      let comprador: Comprador;

      comprador = {
        nombre: this.formPago.value.nombre,
        apellidos: this.formPago.value.apellidos,
        documento: this.formPago.value.numerodoc,
        correo: this.formPago.value.correo,
        tipo_documento: this.formPago.value.tipodoc,
        telefono: this.formPago.value.telefono,
      };

      console.log(this.formDescuento.value.cupon);

      reserva = {
        comprador,
        enrutamiento_ida: this.globals.rutaIda.id,
        fecha_compra: moment().format('DD/MM/YYYY'),
        metodo_pago: this.metodoPago,
        pasajeros,
        cupon: this.formDescuento.value.cupon,
      };
    } else {

      let comprador: Comprador;

      comprador = {
        tipo_documento: this.formPago.value.tipodoc,
        documento: this.formPago.value.numerodoc,
        nombre: this.formPago.value.nombre,
        apellidos: this.formPago.value.apellidos,
        telefono: this.formPago.value.telefono,
        correo: this.formPago.value.correo,
      };

      reserva = {
        comprador,
        enrutamiento_ida: this.globals.rutaIda.id,
        enrutamiento_vuelta: this.globals.rutaVuelta.id,
        fecha_compra: moment().format('DD/MM/YYYY'),
        metodo_pago: this.metodoPago,
        pasajeros,
        cupon: this.formDescuento.value.cupon,
      };
    }

    this.dataService.reservarTiquetes(reserva).subscribe(
      data => {
        let resp;
        resp = data;

        Swal.fire({
          allowOutsideClick: false,
          showCloseButton: false,
          icon: 'success',
          title: 'Hemos generado tu reserva!',
          text: 'A continuación serás redirigido al sitio de pago.',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.replace(resp.url);
        });

        this.formPago.controls.nombre.disable();
        this.formPago.controls.apellidos.disable();
        this.formPago.controls.telefono.disable();
        this.formPago.controls.correo.disable();
        this.formPago.controls.tipodoc.disable();
        this.formPago.controls.numerodoc.disable();

      },
      err => {

        this.formPago.controls.nombre.enable();
        this.formPago.controls.apellidos.enable();
        this.formPago.controls.telefono.enable();
        this.formPago.controls.correo.enable();
        this.formPago.controls.tipodoc.enable();
        this.formPago.controls.numerodoc.enable();

        this.disabledButton = false;
        let error = err.error;
        console.log(error);
        let mensaje: string;
        let titulo: string;

        let count = 0;
        while (count < 4) {
          for (const key1 in error) {
            if (Object.prototype.hasOwnProperty.call(error, key1)) {
              for (const key2 in error) {
                if (Object.prototype.hasOwnProperty.call(error, key2) && typeof error !== 'string') {
                  const element = error[key2];
                  if (typeof key2 === 'string' && key1.length > 2) {
                    titulo = key2;
                  }
                  mensaje = error[key2];
                }
              }
              error = error[key1];
            }
          }
          count++;
        }

        Swal.fire({
          allowOutsideClick: false,
          showCloseButton: true,
          icon: 'error',
          title: titulo,
          text: mensaje,
          onClose: () => {
            if (titulo.includes('puesto')) {
              if (titulo.includes('ida')) {
                this.router.navigateByUrl('/lista-viajes');
              } else {
                this.router.navigateByUrl('/lista-viajes-vuelta');
              }
            }
          },
        });
      },
    );
  }

  registrarUsuario() {
    if (!this.formPago.valid || !this.formRegistro.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Debes proveer todos los datos de usuario para continuar',
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    } else {

      this.formPago.controls.nombre.enable();
      this.formPago.controls.apellidos.enable();
      this.formPago.controls.telefono.enable();
      this.formPago.controls.correo.enable();
      this.formPago.controls.tipodoc.enable();
      this.formPago.controls.numerodoc.enable();

      this.authService.registro(
        this.formRegistro.value.username,
        this.formPago.value.nombre,
        this.formPago.value.apellidos,
        this.formPago.value.correo,
        this.formPago.value.numerodoc,
        this.formPago.value.telefono,
        this.formRegistro.value.password,
      ).subscribe(data => {

        this.formPago.controls.nombre.disable();
        this.formPago.controls.apellidos.disable();
        this.formPago.controls.telefono.disable();
        this.formPago.controls.correo.disable();
        this.formPago.controls.tipodoc.disable();
        this.formPago.controls.numerodoc.disable();
        this.formPago.controls.checkNuevo.disable();

        let resp;
        resp = data;
        console.log(resp);

        if (resp.username != null) {
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'Usuario creado correctamente',
            showCancelButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Usuario no creado',
            text: 'No se ha podido crear el usuario correctamente',
            showCancelButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }
      },
        err => {
          console.log('error: ', err);
        }
      );
    }
  }

  login() {
    if (!this.formLogin.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Debes proveer todos los datos de usuario para continuar',
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    } else {
      this.authService.login(
        this.formLogin.value.username,
        this.formLogin.value.password,
      ).subscribe(data => {
        let resp;
        resp = data;

        if (resp.token != null) {

          this.checkLogin = false;
          this.checkNuevo = false;

          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: false,
            icon: 'success',
            title: `Bienvenido de nuevo ${resp.first_name} ${resp.last_name}`,
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.globals.usuario = resp;

            this.formPago.setValue({
              nombre: `${this.globals.usuario.first_name}`,
              apellidos: `${this.globals.usuario.last_name}`,
              telefono: this.globals.usuario.telefono,
              correo: this.globals.usuario.email,
              tipodoc: 'CC',
              numerodoc: this.globals.usuario.documento,
              checkNuevo: false,
            });
          });
        }
      });
    }
  }

  changeCampo(control, event) {
    if (control.name.includes('document') && event.length >= 6) {
      this.dataService.getDatosPasajero(event).subscribe((value: Pasajero) => {
        this.clients.forEach((client) => {
          client.fields.forEach((field) => {
            if (field.name.includes('first_name')) {
              field.control.setValue(value.nombre);
            } else if (field.name.includes('last_name')) {
              field.control.setValue(value.apellidos);
            } else if (field.name.includes('telefono')) {
              field.control.setValue(value.telefono);
            } else if (field.name.includes('email')) {
              field.control.setValue(value.correo);
            }
          });
        });
      });
    }
  }

  nuevoChange() {
    this.checkNuevo = !this.checkNuevo;
  }

  /**
   * Registra la selección de métodos de pago y hace la petición con la información de pago
   */
  handleChange(metodoSeleccionado) {
    this.metodoPago = metodoSeleccionado;

    if (this.globals.fechaVuelta != null) {
      this.valor = (Number(this.globals.rutaIda.precio_primera_clase) * this.globals.asientosSeleccionadosIda.length)
        + (Number(this.globals.rutaVuelta.precio_primera_clase) * this.globals.asientosSeleccionadosVuelta.length);
    } else {
      this.valor = (Number(this.globals.rutaIda.precio_primera_clase) * this.globals.asientosSeleccionadosIda.length);
    }
    this.dataService.getCobros(this.valor.toString(), this.metodoPago, null).subscribe(dataCobro => {
      this.cuentas = [];
      let resp;
      resp = dataCobro;
      resp.forEach(cobro => {
        this.cuentas.push({ nombre: cobro.nombre, mensaje: cobro.mensaje, valor: cobro.valor });
      });
      const total = this.cuentas.find(dato => (dato.nombre === 'Total'));
      this.globals.totalCompraIda = total.valor.toString();
    });
  }

  redimirCupon() {
    console.log(this.formDescuento.value.cupon);
    if (this.formDescuento.value.cupon != null && this.formDescuento.value.cupon !== '') {
      this.dataService.getCobros(this.valor.toString(), this.metodoPago, this.formDescuento.value.cupon).subscribe(dataCobro => {
        this.cuentas = [];
        let resp;
        resp = dataCobro;

        Swal.fire({
          allowOutsideClick: false,
          showCloseButton: false,
          icon: 'success',
          title: 'Cupon valido',
          text: 'Has redimido exitosamente tu cupon',
          confirmButtonText: 'Aceptar',
        });

        resp.forEach(cobro => {
          this.cuentas.push({ nombre: cobro.nombre, mensaje: cobro.mensaje, valor: cobro.valor });
        });
        const total = this.cuentas.find(dato => (dato.nombre === 'Total'));
        this.globals.totalCompraIda = total.valor.toString();
      }, err => {
        console.log('ERROR: ', err);

        Swal.fire({
          allowOutsideClick: false,
          showCloseButton: true,
          icon: 'error',
          title: 'Cupon invalido',
          text: 'Ingresa un codigo de cupon valido y prueba nuevamente',
          onClose: () => {
            this.formDescuento.setValue({
              cupon: '',
            });
          },
        });

      });
    }
  }

  /**
   * Registra los cambios realizados a los datos de los pasajeros
   */
  onChangePasajero(documento) {
    this.datosPago = true;

    console.log(documento);
    if (documento === 'login') {

      this.checkNuevo = false;
      this.checkLogin = true;

      this.formPago.controls.nombre.disable();
      this.formPago.controls.apellidos.disable();
      this.formPago.controls.telefono.disable();
      this.formPago.controls.correo.disable();
      this.formPago.controls.tipodoc.disable();
      this.formPago.controls.numerodoc.disable();
      this.formPago.controls.checkNuevo.disable();

      this.formPago.setValue({
        nombre: null,
        apellidos: null,
        telefono: null,
        correo: null,
        tipodoc: 'CC',
        numerodoc: null,
        checkNuevo: this.checkNuevo,
      });

    } else if (documento === 'otro') {

      this.checkLogin = false;

      this.formPago.setValue({
        nombre: null,
        apellidos: null,
        telefono: null,
        correo: null,
        tipodoc: 'CC',
        numerodoc: null,
        checkNuevo: this.checkNuevo,
      });

      this.formPago.controls.nombre.enable();
      this.formPago.controls.apellidos.enable();
      this.formPago.controls.telefono.enable();
      this.formPago.controls.correo.enable();
      this.formPago.controls.tipodoc.enable();
      this.formPago.controls.numerodoc.enable();
      this.formPago.controls.checkNuevo.enable();

    } else if (documento === 'auth') {

      this.checkNuevo = false;
      this.checkLogin = false;

      this.formPago.controls.nombre.disable();
      this.formPago.controls.apellidos.disable();
      this.formPago.controls.telefono.disable();
      this.formPago.controls.correo.disable();
      this.formPago.controls.tipodoc.disable();
      this.formPago.controls.numerodoc.disable();
      this.formPago.controls.checkNuevo.disable();

      this.formPago.setValue({
        nombre: `${this.authUser.first_name}`,
        apellidos: `${this.authUser.last_name}`,
        telefono: this.authUser.telefono,
        correo: this.authUser.email,
        tipodoc: 'CC',
        numerodoc: this.authUser.documento,
        checkNuevo: false,
      });
    } else {

      this.checkLogin = false;

      this.formPago.controls.nombre.disable();
      this.formPago.controls.apellidos.disable();
      this.formPago.controls.telefono.disable();
      this.formPago.controls.correo.disable();
      this.formPago.controls.tipodoc.disable();
      this.formPago.controls.numerodoc.disable();
      this.formPago.controls.checkNuevo.enable();

      const cliente = this.getFormData().find(data => (data.documento === documento));
      this.formPago.setValue({
        nombre: cliente.nombre,
        apellidos: cliente.apellidos,
        telefono: cliente.telefono,
        correo: cliente.correo,
        tipodoc: cliente.tipodoc,
        numerodoc: cliente.documento,
        checkNuevo: this.checkNuevo,
      });
    }
  }

  /**
   * Retorna una lista con los datos de cada pasajero
   */
  getFormData(): any[] {
    const clients = [];

    if (this.globals.asientosSeleccionadosIda != null) {
      this.globals.asientosSeleccionadosIda.forEach((asiento, i) => {
        const client = 'client' + asiento.numero;

        clients.push({
          tipo: this.globals.rutaVuelta != null ? 'iyv' : 'i',
          asientoIda: asiento.numero,
          asientoVuelta: this.globals.rutaVuelta != null ? this.globals.asientosSeleccionadosVuelta[i].numero : null,
          tripIdIda: this.globals.rutaIda.id.toString(),
          tripIdVuelta: this.globals.rutaVuelta != null ? this.globals.rutaVuelta.id : null,
          nombre: this.myForm.controls[client].get('first_name' + asiento.numero).value,
          apellidos: this.myForm.controls[client].get('last_name' + asiento.numero).value,
          telefono: this.myForm.controls[client].get('telefono' + asiento.numero).value,
          tipodoc: this.myForm.controls[client].get('type' + asiento.numero).value,
          documento: this.myForm.controls[client].get('document' + asiento.numero).value,
          correo: this.myForm.controls[client].get('email' + asiento.numero).value,
        });
      });
    }

    return clients;
  }

  /**
   * Agrupa los nombres de los campos con sus valores para mostrarlos en la interfaz
   */
  private groupify(fields: Field[]): FormGroup {
    const rv = new FormGroup({});
    fields.forEach(field => {
      rv.addControl(field.name, (field.control = new FormControl('')));
    });
    return rv;
  }
}
