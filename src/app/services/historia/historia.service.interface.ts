import { Acontecimiento } from '../../shared/prismic/models/acontecimiento.dto';
import { Premio } from '../../shared/prismic/models/premio.dto';
import { DatosEmpresa } from 'src/app/shared/prismic/models/datosEmpresa.dto';

/// Interfaz de servicio de hisotria de la empresa
export interface HistoriaService {
    getDatosEmpresa(): Promise<DatosEmpresa>;
    getHistoria(): Promise<string>;
    getAcontecimientos(): Promise<Acontecimiento[]>;
    getPremios(): Promise<Premio[]>;
}
