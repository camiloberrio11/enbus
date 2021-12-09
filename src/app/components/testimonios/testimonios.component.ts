import { Component, OnInit } from '@angular/core';
import { TestimoniosServiceImpl } from '../../services/testimonios/testimonios.service';
import { Testimonio } from '../../shared/prismic/models/testimonio.dto';

@Component({
  selector: 'app-testimonios',
  templateUrl: './testimonios.component.html',
  styleUrls: ['./testimonios.component.css']
})
/// Componente dedicado para la página de testimonios
export class TestimoniosComponent implements OnInit {

  testimonios: Testimonio[];
  isMobileResolution: boolean;

  constructor(
    private testimonioService: TestimoniosServiceImpl,
  ) {
    if (window.innerWidth < 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  ngOnInit() {
    /// Hace la peticion de la lista de testimonios
    this.testimonioService.getTestimonios().then(data => this.testimonios = data);
  }

}
