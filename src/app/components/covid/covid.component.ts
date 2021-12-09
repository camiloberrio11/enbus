import { Component, OnInit } from '@angular/core';
import { CovidServiceImpl } from 'src/app/services/covid/covid.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.css']
})
/**
 * Componente dedicado para la página de covid
 * Se encarga de mostrar los requisitos de viaje para los usuarios
 */
export class CovidComponent implements OnInit {

  textos: any[] = [];
  tipos: string[] = [];
  links = [];
  constructor(
    private sanitizer: DomSanitizer,
    private covidService: CovidServiceImpl,
  ) { }

  /**
   * Obtiene la informacion referente a COVID-19
   */
  ngOnInit() {
    this.covidService.getInfo().then(data => {
      let resp;
      resp = data[0].data.informacion;
      resp.forEach(info => {
        info.url != null ? this.textos.push(info.url) : this.textos.push(info.text);
        this.tipos.push(info.type);
        info.spans != null ? this.links.push(info.spans) : this.links.push(null);
      });
    });
  }

  /**
   * Obtiene el contenido para mostrarlo en la vista
   */
  getContent(index: number) {
    let content: string;
    const tipo: string = this.tipos[index];
    const link: any[] = this.links[index];
    switch (tipo) {
      case 'image':
        content = `<div class="d-flex flex-row justify-content-center"><img src="${this.textos[index]}" class="myQr"></div>`;
        break;

      case 'heading5':
        content = `<br><h5>${this.textos[index]}</h5>`;
        break;

      case 'list-item':
        content = `<li>${this.textos[index]}</li>`;
        break;

      default:
        // case paragraph

        if (link.length > 0) {
          // content = `<span>${this.textos[index]}</span><br>`;
          link.forEach(dato => {
            if (dato.type === 'hyperlink') {
              content = `<span>${this.textos[index].replace(this.textos[index].slice(dato.start, dato.end),
                `<a href="${dato.data.url}">${this.textos[index].slice(dato.start, dato.end)}</a>`
              )}</span><br>`;
            } else if (dato.type === 'strong') {
              content = `<strong>${this.textos[index]}</strong><br>`;
            } else {
              content = `<span>${this.textos[index]}</span><br>`;
            }

          });
        } else {
          content = `<span>${this.textos[index]}</span><br>`;
        }
        break;
    }
    return content;
  }

  /**
   * Retorna una url verificada
   */
  getSecureUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
