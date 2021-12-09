import { Valor } from '../../shared/prismic/models/valor.dto';

/// Interfaz de servicio de perfil empresarial
export interface PerfilService {
    getMision(): Promise<string>;
    getVision(): Promise<string>;
    getValores(): Promise<Valor[]>;
}
