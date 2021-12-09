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
} from '../../shared/prismic/models/slider.dto';
import Swal from 'sweetalert2';
import { ContactoServiceImpl } from 'src/app/services/contacto/contacto.service';
import { HistoriaServiceImpl } from 'src/app/services/historia/historia.service';
import { GlobalService } from 'src/app/services/global/global.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
/// Componente dedicado para la página de inicio
/// Se encarga de mostrar la información principal de la empresa y es el primer paso para el IBE
export class InicioComponent implements OnInit {
  paymentsMethod = [
    'assets/images/tc.png',
    'assets/images/susuerte.png',
    'assets/images/sured.png',
    'assets/images/redservi.png',
    'assets/images/puntored.png',
    'assets/images/pse.png',
    'assets/images/baloto.png',
    'assets/images/bancolombia.png',
    'assets/images/efecty.png',
    'assets/images/gana.png',
    'assets/images/apostar.png',
    'assets/images/nequi.png',
    'assets/images/dimonex.png',
    'assets/images/payvalida.png',
  ];

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
    public globals: GlobalService
  ) {}

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

    this.dataService.getOrigenes().subscribe((data) => {
      let resp;
      console.log(data);
      resp = data;
      resp.forEach((element) => {
        this.origenes.push(element.origen);
      });

      this.origenesFiltrados = this.tripForm.valueChanges.pipe(
        startWith(''),
        map(() => {
          const filterValue = this.tripForm.value.origen.toLowerCase();
          return this.origenes.filter((option) =>
            option.toLowerCase().includes(filterValue)
          );
        })
      );
    });

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
    this.testimoniosService
      .get2Testimonios()
      .then((dataTestimonios) => (this.testimonios = dataTestimonios));
    /// Hace la petición de las imágenes que serán mostradas en el slider inicial
    this.sliderService
      .getSliderInicio()
      .then((dataSlider) => (this.sliderInicio = dataSlider));
    /// Hace la petición de las imágenes que serán mostradas en el slider de la galería
    this.sliderService
      .getSliderGaleria()
      .then((dataSlider) => (this.sliderGaleria = dataSlider));
  }

  /// Metodo ejecutado al seleccionar un origen
  onChangeOrigen(deviceValue) {
    /// Hace la petición de la lista de destinos teniendo en cuenta el origen seleccionado
    // this.destinos = this.dataService.getDestinos(deviceValue);

    console.log(deviceValue);

    this.destinos = [];

    this.globals.origen = deviceValue;
    this.dataService.getDestinos(deviceValue).subscribe((data) => {
      let resp;
      resp = data;
      resp.forEach((element) => {
        this.destinos.push(element.destino);
      });
      // this.destinos = lista;

      this.destinosFiltrados = this.tripForm.valueChanges.pipe(
        startWith(''),
        map(() => {
          const filterValue = this.tripForm.value.destino.toLowerCase();
          return this.destinos.filter((option) =>
            option.toLowerCase().includes(filterValue)
          );
        })
      );
    });
    this.disableDestino = null;
  }

  /// Metodo ejecutado al seleccionar un destino
  onChangeDestino(deviceValue) {
    this.globals.destino = deviceValue;
    let resp;
    let resp2;
    const self = this;
    /// Hace la petición de la fecha máxima de viaje de ida
    this.dataService
      .getFecha(this.globals.origen, this.globals.destino)
      .subscribe((dataFecha) => {
        resp = dataFecha;
        console.log(resp);
        if (resp.fecha == null) {
          Swal.fire({
            title: 'No hay viajes disponibles',
            text: `Lo sentimos, no hay viajes disponibles para la ruta ${this.globals.origen} - ${this.globals.destino}`,
            icon: 'info',
            showCancelButton: false,
            showConfirmButton: true,
          });
          this.disableFechaIda = '';
          this.disableFechaVuelta = '';
        } else {
          self.fechaMaxIda = moment(resp.fecha, 'DD/MM/YYYY')
            .add('1', 'days')
            .format('YYYY-MM-DD');
          this.disableFechaIda = null;

          this.dataService
            .getFecha(this.globals.destino, this.globals.origen)
            .subscribe((dataFecha2) => {
              resp2 = dataFecha2;
              if (resp2.fecha == null) {
                this.disableFechaVuelta = '';
              } else {
                this.disableFechaVuelta = null;
                console.log(resp2);
                self.fechaMaxVuelta = moment(resp2.fecha, 'DD/MM/YYYY')
                  .add('1', 'days')
                  .format('YYYY-MM-DD');
              }
            });
        }
      });
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
    console.log(this.globals);
    this.getViajes();
  }

  getViajes() {
    /// Hace la petición de lista de viajes de ida
    this.dataService
      .getEnrutamientos(
        this.globals.origen,
        this.globals.destino,
        this.globals.fechaIda
      )
      .subscribe((dataIda) => {
        let resp1;
        resp1 = dataIda;
        /// Si hay viajes de ida disponibles
        if (resp1.length > 0) {
          // this.globals.origen = this.tripForm.value.origen;
          // this.globals.destino = this.tripForm.value.destino;
          // this.globals.fechaIda = this.datePipe.transform(this.tripForm.value.ida, 'yyyy-MM-dd');
          // this.globals.fechaVuelta = this.datePipe.transform(this.tripForm.value.vuelta, 'yyyy-MM-dd');

          // localStorage.clear();

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
          // tslint:disable-next-line: max-line-length
          // this.router.navigateByUrl(`/lista-viajes/?origen=${this.globals.origen}&destino=${this.globals.destino}&fecha=${this.globals.fechaIda}`);
        } else {
          /// Si no hay viajes de ida disponibles
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
        }
        if (this.tripForm.value.vuelta !== '') {
          /// Hace la peticion de viajes de vuelta
          this.dataService
            .getEnrutamientos(
              this.globals.destino,
              this.globals.origen,
              this.globals.fechaVuelta
            )
            .subscribe((dataVuelta) => {
              let resp2;
              resp2 = dataVuelta;
              if (resp2.length > 0) {
                /// Si hay viajes de vuelta disponibles
                // this.globals.origen = this.tripForm.value.origen;
                // this.globals.destino = this.tripForm.value.destino;
                // this.globals.fechaIda = this.datePipe.transform(this.tripForm.value.ida, 'yyyy-MM-dd');
                // this.globals.fechaVuelta = this.datePipe.transform(this.tripForm.value.vuelta, 'yyyy-MM-dd');

                localStorage.setItem('origen', null);
                localStorage.setItem('destino', null);
                localStorage.setItem('cantidad', null);
                localStorage.setItem('fechaIda', null);
                localStorage.setItem('fechaVuelta', null);
                // localStorage.clear();

                localStorage.setItem('origen', this.globals.origen);
                localStorage.setItem('destino', this.globals.destino);
                localStorage.setItem('fechaIda', this.globals.fechaIda);
                localStorage.setItem('fechaVuelta', this.globals.fechaVuelta);

                this.router.navigateByUrl('/lista-viajes/');
                // tslint:disable-next-line: max-line-length
                // this.router.navigateByUrl(`/lista-viajes/?origen=${this.globals.origen}&destino=${this.globals.destino}&fecha=${this.globals.fechaIda}`);
              } else {
                /// Si no hay viajes de vuelta disponibles
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
              }
            });
        }
      });
  }
}
