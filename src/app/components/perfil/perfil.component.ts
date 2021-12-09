import { Component, OnInit } from '@angular/core';
import { PerfilServiceImpl } from '../../services/perfil/perfil.service';
import { Valor } from '../../shared/prismic/models/valor.dto';
import { SliderServiceImpl } from 'src/app/services/slider/slider.service';
import { SliderGaleria } from 'src/app/shared/prismic/models/slider.dto';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
/// Componente dedicado para la página de perfil de la empresa
export class PerfilComponent implements OnInit {

  valores: Valor[];
  mision: string;
  vision: string;
  sliderGaleria: SliderGaleria[];

  constructor(
    private perfilService: PerfilServiceImpl,
    private sliderService: SliderServiceImpl,
  ) { }

  ngOnInit() {
    /// Hace la petición de la misión empresarial
    this.perfilService.getMision().then(data => this.mision = data);
    /// Hace la petición de la visión empresarial
    this.perfilService.getVision().then(data => this.vision = data);
    /// Hace la petición de los valores corporativos
    this.perfilService.getValores().then(data => this.valores = data);
    /// Hace la petición de las imágenes para mostrar en el slider de la galería
    this.sliderService.getSliderGaleria().then(dataSlider => this.sliderGaleria = dataSlider);
  }

}
