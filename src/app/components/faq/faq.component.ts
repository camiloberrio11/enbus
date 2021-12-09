import { Component, OnInit } from '@angular/core';
import { FaqServiceImpl } from '../../services/faq/faq.service';
import { Faq } from '../../shared/prismic/models/faq.dto';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
/**
 * Componente dedicado para la página de preguntas frecuentes
 * Se encarga de mostrar la lista de preguntas frecuentes
 */
export class FaqComponent implements OnInit {

  faqs: Faq[];
  isMobileResolution: boolean;

  constructor(
    private faqService: FaqServiceImpl,
  ) {
    if (window.innerWidth <= 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  ngOnInit() {
    /**
     * Petición de lista de preguntas frecuentes creadas
     */
    this.faqService.getFaqs().then(data => this.faqs = data);
  }

}
