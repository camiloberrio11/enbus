import { Faq } from '../../shared/prismic/models/faq.dto';

/// Interfaz de servicio de preguntas frecuentes
export interface FaqService {
    getFaqs(): Promise<Faq[]>;
    get3Faqs(): Promise<Faq[]>;
}