import { Contacto } from '../../shared/prismic/models/contacto.dto';
import { Sede } from '../../shared/prismic/models/sede.dto';
import { Whatsapp } from '../../shared/prismic/models/whatsapp.dto';
import { Encuesta } from 'src/app/shared/prismic/models/encuesta.dto';

/// Interfaz de servicio de contacto
export interface ContactoService {
    getContacto(): Promise<Contacto>;
    getSedes(): Promise<Sede[]>;
    getWhatsappInfo(): Promise<Whatsapp>;
    getEncuestaSatisfaccion(): Promise<Encuesta>;
}
