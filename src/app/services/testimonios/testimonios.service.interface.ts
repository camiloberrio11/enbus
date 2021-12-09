import { Testimonio } from '../../shared/prismic/models/testimonio.dto';

/// Interfaz de servicio de los testiomnios
export interface TestimoniosService {
    getTestimonios(): Promise<Testimonio[]>;
    get2Testimonios(): Promise<Testimonio[]>;
}