import { Component, OnInit } from '@angular/core';
import { DocumentosServiceImpl } from '../../services/documentos/documentos.service';
import { Documento } from '../../shared/prismic/models/documento.dto';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  documentos: Documento[];

  constructor(
    private sanitizer: DomSanitizer,
    private documentosService: DocumentosServiceImpl,
  ) { }

  /**
   * Obtiene los documentos para mostrarlos
   */
  ngOnInit() {
    this.documentosService.getDocumentos().then(data => {
      this.documentos = data;
    });
  }

  /**
   * Retorna una url segura
   */
  getSecureUrl(index: number) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.documentos[index].archivo);
  }

}
