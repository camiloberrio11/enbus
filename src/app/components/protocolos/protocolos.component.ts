import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProtocolosServiceImpl } from 'src/app/services/protocolos/protocolos.service';
import { Protocolo } from 'src/app/shared/prismic/models/protocolo.dto';

@Component({
  selector: 'app-protocolos',
  templateUrl: './protocolos.component.html',
  styleUrls: ['./protocolos.component.css']
})
export class ProtocolosComponent implements OnInit {

  protocolos: Protocolo[];

  constructor(
    private sanitizer: DomSanitizer,
    private protocolosService: ProtocolosServiceImpl,
  ) { }

  /**
   * Obtiene los protocolos para mostrarlos
   */
  ngOnInit() {
    this.protocolosService.getProtocolos().then(data => {
      this.protocolos = data;
    });
  }

  /**
   * Retorna una url segura
   */
  getSecureUrl(index: number) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.protocolos[index].imagen);
  }
}
