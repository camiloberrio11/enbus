import { Component, OnInit } from '@angular/core';
import { DescuentosServiceImpl } from '../../services/descuentos/descuentos.service';
import { Descuento } from '../../shared/prismic/models/descuento.dto';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-descuentos',
  templateUrl: './descuentos.component.html',
  styleUrls: ['./descuentos.component.css']
})
export class DescuentosComponent implements OnInit {

  descuentos: Descuento[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private descuentosService: DescuentosServiceImpl,
  ) { }

  /**
   * Obtiene los descuentos para mostrarlos
   */
  ngOnInit() {
    this.descuentosService.getDescuentos().then(data => {
      let resp;
      // console.log(data);
      resp = data;
      resp.forEach(element => {
        const info = [];
        element.data.informacion.forEach(element2 => {
          info.push(element2);
        });

        const nuevoDescuento: Descuento = {
          nombre: element.data.nombre[0].text,
          icono: element.data.icono.url,
          informacion: info,
        };

        this.descuentos.push(nuevoDescuento);
      });
    });

    console.log(this.descuentos);
  }

  /**
   * Retorna una url segura
   */
  getSecureUrl(index: number) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.descuentos[index].icono);
  }

  /**
   * Obtiene el contenido para mostrarlo en la vista
   */
  getContent(index1: number, index2: number) {
    let content: string;
    const tipo: string = this.descuentos[index1].informacion[index2].type;
    const texto: string = this.descuentos[index1].informacion[index2].text;
    switch (tipo) {
      case 'image':
        content = `<div class="d-flex flex-row justify-content-center"><img src="${texto}" class="myQr"></div>`;
        break;

      case 'heading5':
        content = `<br><h5>${texto}</h5>`;
        break;

      case 'list-item':
        content = `<ul><li>${texto}</li></ul>`;
        break;

      default:
        // case paragraph
        content = `<span>${texto}</span><br>`;
        break;
    }
    return content;
  }

}
