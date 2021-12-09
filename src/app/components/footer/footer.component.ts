import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

/**
 * Componente dedicado para el footer
 */
export class FooterComponent implements OnInit {

  year: number;
  isMobileResolution: boolean;

  constructor() {
    if (window.innerWidth <= 1024) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  /**
   * Obtiene el año actual
   */
  ngOnInit() {
    this.year = new Date().getFullYear();
  }

  /**
   * Determina si la resolucion es de celular
   */
  public getIsMobileResolution(): boolean {
    return this.isMobileResolution;
  }

}
