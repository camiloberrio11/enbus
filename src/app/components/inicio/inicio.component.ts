import { MetodosPago } from 'src/app/shared/prismic/models/slider.dto';
import { EmpresaAsociada } from './../../shared/prismic/models/slider.dto';
import { Component, OnChanges, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { InicioServiceImpl } from '../../services/inicio/inicio.service';
import { DataService } from '../../services/data/data.service';
import { FaqServiceImpl } from '../../services/faq/faq.service';
import { TestimoniosServiceImpl } from '../../services/testimonios/testimonios.service';
import { SliderServiceImpl } from '../../services/slider/slider.service';
import { Faq } from '../../shared/prismic/models/faq.dto';
import { Testimonio } from '../../shared/prismic/models/testimonio.dto';
import {
  SliderInicio,
  SliderGaleria,
  CardHome,
} from '../../shared/prismic/models/slider.dto';
import Swal from 'sweetalert2';
import { ContactoServiceImpl } from 'src/app/services/contacto/contacto.service';
import { HistoriaServiceImpl } from 'src/app/services/historia/historia.service';
import { GlobalService } from 'src/app/services/global/global.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EnbusService } from 'src/app/services/enbus/enbus.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
/// Componente dedicado para la página de inicio
/// Se encarga de mostrar la información principal de la empresa y es el primer paso para el IBE
export class InicioComponent implements OnInit {
  cardsHome: CardHome[] = [];
  empresasAsociadas: EmpresaAsociada[] = [];
  paymentsMethod: MetodosPago[] = [];

  faqs: Faq[];
  testimonios: Testimonio[];
  sliderInicio: SliderInicio[];
  sliderGaleria: SliderGaleria[];
  mensajeEncuesta: string;
  urlEncuesta: string;
  experiencia: string;
  rutas: string;
  ciudadesEmpresa: string;

  ciudades: any = ['CIUDAD 1', 'CIUDAD 2', 'CIUDAD 3', 'CIUDAD 4', 'CIUDAD5'];
  fechaMaxIda;
  fechaMaxVuelta;
  fechaMinimaIda = moment().add('1', 'days').format('YYYY-MM-DD');
  fechaMinimaVuelta = moment().add('1', 'days').format('YYYY-MM-DD');
  origenes: string[] = [];
  destinos: string[] = [];

  tripForm = new FormGroup({
    origen: new FormControl('', Validators.required),
    destino: new FormControl('', Validators.required),
    ida: new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]),
    vuelta: new FormControl(''),
  });

  disableDestino = '';
  disableFechaIda = '';
  disableFechaVuelta = '';
  imagenPopup: string;

  dateFilterIda;
  dateFilterVuelta;

  origenesFiltrados: Observable<string[]>;
  destinosFiltrados: Observable<string[]>;

  constructor(
    private router: Router,
    private inicioService: InicioServiceImpl,
    private contactoService: ContactoServiceImpl,
    private historiaService: HistoriaServiceImpl,
    private faqService: FaqServiceImpl,
    private testimoniosService: TestimoniosServiceImpl,
    private sliderService: SliderServiceImpl,
    private dataService: DataService,
    public globals: GlobalService,
    private enbusService: EnbusService
  ) {
    this.getOrigins();
  }

  ngOnInit() {
    this.globals.origen = null;
    this.globals.destino = null;
    this.globals.cantidad = null;
    this.globals.fechaIda = null;
    this.globals.fechaVuelta = null;

    localStorage.setItem('origen', null);
    localStorage.setItem('destino', null);
    localStorage.setItem('cantidad', null);
    localStorage.setItem('fechaIda', null);
    localStorage.setItem('fechaVuelta', null);

    localStorage.removeItem('rutaIda');

    /// Hace la petición de los origenes disponibles para viajar
    // this.origenes = this.dataService.getOrigenes();

    // this.dataService.getOrigenes().subscribe((data) => {
    //   let resp;
    //   console.log(data);
    //   resp = data;
    //   resp.forEach((element) => {
    //     this.origenes.push(element.origen);
    //   });

    //   this.origenesFiltrados = this.tripForm.valueChanges.pipe(
    //     startWith(''),
    //     map(() => {
    //       const filterValue = this.tripForm.value.origen.toLowerCase();
    //       return this.origenes.filter((option) =>
    //         option.toLowerCase().includes(filterValue)
    //       );
    //     })
    //   );
    // });

    /// Hace la petición de 3 preguntas frecuentes para ser mostradas en el inicio
    this.faqService.get3Faqs().then((dataFecha) => (this.faqs = dataFecha));
    this.contactoService.getEncuestaSatisfaccion().then((info) => {
      this.mensajeEncuesta = info.mensaje;
      this.urlEncuesta = info.url;
    });
    /// Hace la petición de los datos de la empresa
    this.historiaService.getDatosEmpresa().then((info) => {
      this.experiencia = info.experiencia;
      this.rutas = info.rutas;
      this.ciudadesEmpresa = info.ciudades;
    });
    /// Hace la petición de 2 testimonios para ser mostrados en su sección
    // this.testimoniosService
    //   .get2Testimonios()
    //   .then((dataTestimonios) => (this.testimonios = dataTestimonios));
    /// Hace la petición de las imágenes que serán mostradas en el slider inicial
    this.sliderService
      .getSliderInicio()
      .then((dataSlider) => (this.sliderInicio = dataSlider));
    /// Hace la petición de las imágenes que serán mostradas en el slider de la galería
    this.sliderService
      .getSliderGaleria()
      .then((dataSlider) => (this.sliderGaleria = dataSlider));

    this.sliderService
      .getCardsHome()
      .then((dataSlider) => (this.cardsHome = dataSlider));

    this.sliderService
      .getEmpresasAsociadas()
      .then((info) => (this.empresasAsociadas = info));

    // Obtener metodos pago
    this.sliderService
      .getMetodosPago()
      .then((info) => (this.paymentsMethod = info));
  }

  /// Metodo ejecutado al seleccionar un origen
  onChangeOrigen(deviceValue) {
    /// Hace la petición de la lista de destinos teniendo en cuenta el origen seleccionado
    // this.destinos = this.dataService.getDestinos(deviceValue);

    this.destinos = [];
    this.globals.origen = deviceValue;
    this.enbusService.getDeparture(deviceValue).subscribe(
      (depa) => {
        this.destinos = depa.data;

        this.destinosFiltrados = this.tripForm.valueChanges.pipe(
          startWith(''),
          map(() => {
            const filterValue = this.tripForm.value.destino.toLowerCase();
            return this.destinos.filter((option) =>
              option.toLowerCase().includes(filterValue)
            );
          })
        );
      },
      (err) => {}
    );
    // this.dataService.getDestinos(deviceValue).subscribe((data) => {
    //   console.log(data)
    //   let resp;
    //   resp = data;
    //   resp.forEach((element) => {
    //     this.destinos.push(element.destino);
    //   });
    //   // this.destinos = lista;

    //   this.destinosFiltrados = this.tripForm.valueChanges.pipe(
    //     startWith(''),
    //     map(() => {
    //       const filterValue = this.tripForm.value.destino.toLowerCase();
    //       return this.destinos.filter((option) =>
    //         option.toLowerCase().includes(filterValue)
    //       );
    //     })
    //   );
    // });
    this.disableDestino = null;
  }

  /// Metodo ejecutado al seleccionar un destino
  onChangeDestino(deviceValue) {
    this.globals.destino = deviceValue;
    const day = new Date().getDay();
    const dayFormat = `${day}`.padStart(2, '0');
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    // const self = this;
    /// Hace la petición de la fecha máxima de viaje de ida
    this.enbusService
      .getFechaMaxima(
        this.globals.origen,
        this.globals.destino,
        `${dayFormat}/${month}/${year}`
      )
      .subscribe(
        (dataIda) => {
          if (!dataIda.data.fecha) {
            Swal.fire({
              title: 'No hay viajes disponibles',
              text: `Lo sentimos, no hay viajes disponibles para la ruta ${this.globals.origen} - ${this.globals.destino}`,
              icon: 'info',
              showCancelButton: false,
              showConfirmButton: true,
            });
            this.disableFechaIda = '';
            this.disableFechaVuelta = '';
            return;
          }
          this.fechaMaxIda = moment(dataIda.data.fecha, 'DD/MM/YYYY')
            .add('1', 'days')
            .format('YYYY-MM-DD');
          this.disableFechaIda = null;

          this.enbusService
            .getFechaMaxima(
              this.globals.destino,
              this.globals.origen,
              `${dayFormat}/${month}/${year}`
            )
            .subscribe(
              (dataVuelta) => {
                if (!dataVuelta.data.fecha) {
                  this.disableFechaVuelta = '';
                  return;
                }
                this.disableFechaVuelta = null;
                this.fechaMaxVuelta = moment(
                  dataVuelta.data.fecha,
                  'DD/MM/YYYY'
                )
                  .add('1', 'days')
                  .format('YYYY-MM-DD');
              },
              (err) => {}
            );
        },
        (err) => {}
      );

    // this.dataService
    //   .getFecha(this.globals.origen, this.globals.destino)
    //   .subscribe((dataFecha) => {
    //     resp = dataFecha;
    //     console.log(resp);
    //     if (resp.fecha == null) {
    //       Swal.fire({
    //         title: 'No hay viajes disponibles',
    //         text: `Lo sentimos, no hay viajes disponibles para la ruta ${this.globals.origen} - ${this.globals.destino}`,
    //         icon: 'info',
    //         showCancelButton: false,
    //         showConfirmButton: true,
    //       });
    //       this.disableFechaIda = '';
    //       this.disableFechaVuelta = '';
    //     } else {
    //       self.fechaMaxIda = moment(resp.fecha, 'DD/MM/YYYY')
    //         .add('1', 'days')
    //         .format('YYYY-MM-DD');
    //       this.disableFechaIda = null;

    //       this.dataService
    //         .getFecha(this.globals.destino, this.globals.origen)
    //         .subscribe((dataFecha2) => {
    //           resp2 = dataFecha2;
    //           if (resp2.fecha == null) {
    //             this.disableFechaVuelta = '';
    //           } else {
    //             this.disableFechaVuelta = null;
    //             console.log(resp2);
    //             self.fechaMaxVuelta = moment(resp2.fecha, 'DD/MM/YYYY')
    //               .add('1', 'days')
    //               .format('YYYY-MM-DD');
    //           }
    //         });
    //     }
    //   });
    /// Hace la petición de la fecha máxima de viaje de vuelta
  }

  // /// Metodo ejecutado al seleccionar fecha de ida
  // /// Camia la fecha minima de viaje de vuelta
  // onChangeFechaIda(deviceValue) {
  //   this.fechaMinimaVuelta = deviceValue;
  // }

  /// Metodo ejecutado al seleccionar fecha de ida
  /// Camia la fecha minima de viaje de vuelta
  onChangeFechaIda(deviceValue) {
    this.fechaMinimaVuelta = moment(deviceValue.value)
      .add(1, 'days')
      .format('YYYY-MM-DD');
    this.globals.fechaIda = moment(deviceValue.value).format('DD/MM/YYYY');
    console.log('ida', this.globals.fechaIda);
    // this.fechaMinimaVuelta = deviceValue;
    this.fechaMinimaVuelta = moment(this.globals.fechaIda, 'DD/MM/YYYY')
      .add(1, 'days')
      .format('YYYY-MM-DD');
  }

  /// Metodo ejecutado al seleccionar fecha de ida
  /// Camia la fecha minima de viaje de vuelta
  onChangeFechaVuelta(deviceValue) {
    this.globals.fechaVuelta = moment(deviceValue.value).format('DD/MM/YYYY');
    console.log('vuelta', this.globals.fechaVuelta);
  }

  /// Metodo de envío de datos de busqueda
  onSubmit() {
    this.getViajes();
  }

  getViajes() {
    /// Hace la petición de lista de viajes de ida
    this.enbusService
      .getAvailability(
        this.globals.origen,
        this.globals.destino,
        this.globals.fechaIda
      )
      .subscribe(
        (disp) => {
          if (disp.data.length < 1) {
            Swal.fire({
              allowOutsideClick: false,
              showCloseButton: true,
              icon: 'warning',
              // tslint:disable-next-line: max-line-length
              text:
                this.globals.origen !== ''
                  ? // tslint:disable-next-line: max-line-length
                    `Oops, no hemos encontrado viajes disponibles entre ${this.globals.origen} y ${this.globals.destino} en esta fecha.`
                  : `Oops, no hemos encontrado viajes disponibles entre ${this.globals.origen} y ${this.globals.destino} en esta fecha.`,
              onClose: () => this.router.navigateByUrl('/'),
            });
            return;
          }
          localStorage.setItem('origen', null);
          localStorage.setItem('destino', null);
          localStorage.setItem('cantidad', null);
          localStorage.setItem('fechaIda', null);
          localStorage.setItem('fechaVuelta', null);
          localStorage.setItem('origen', this.globals.origen);
          localStorage.setItem('destino', this.globals.destino);
          localStorage.setItem('fechaIda', this.globals.fechaIda);
          if (this.globals.fechaVuelta != null) {
            localStorage.setItem('fechaVuelta', this.globals.fechaVuelta);
          }
          this.router.navigateByUrl('/lista-viajes/');

          if (this.tripForm.value.vuelta !== '') {
            this.enbusService
              .getAvailability(
                this.globals.destino,
                this.globals.origen,
                this.globals.fechaVuelta
              )
              .subscribe(
                (dispVuelta) => {
                  if (dispVuelta.data.length < 1) {
                    Swal.fire({
                      allowOutsideClick: false,
                      showCloseButton: true,
                      icon: 'warning',
                      // tslint:disable-next-line: max-line-length
                      text:
                        this.globals.origen !== ''
                          ? // tslint:disable-next-line: max-line-length
                            `Oops, no hemos encontrado viajes disponibles entre ${this.globals.destino} y ${this.globals.origen} en esta fecha.`
                          : `Oops, no hemos encontrado viajes disponibles entre ${this.globals.destino} y ${this.globals.origen} en esta fecha.`,
                      onClose: () => this.router.navigateByUrl('/'),
                    });
                    return;
                  }

                  localStorage.setItem('origen', null);
                  localStorage.setItem('destino', null);
                  localStorage.setItem('cantidad', null);
                  localStorage.setItem('fechaIda', null);
                  localStorage.setItem('fechaVuelta', null);
                  localStorage.setItem('origen', this.globals.origen);
                  localStorage.setItem('destino', this.globals.destino);
                  localStorage.setItem('fechaIda', this.globals.fechaIda);
                  localStorage.setItem('fechaVuelta', this.globals.fechaVuelta);

                  this.router.navigateByUrl('/lista-viajes/');
                },
                (err) => {}
              );
          }
        },
        (err) => {}
      );
  }

  private getOrigins(): void {
    this.enbusService.getOrigins().subscribe(
      (org) => {
        this.origenes = org.data;
        this.origenesFiltrados = this.tripForm.valueChanges.pipe(
          startWith(''),
          map(() => {
            const filterValue = this.tripForm.value.origen.toLowerCase();
            return this.origenes.filter((option) =>
              option.toLowerCase().includes(filterValue)
            );
          })
        );
      },
      (err) => {}
    );
  }
}
