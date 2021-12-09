import { Ruta } from '../../shared/prismic/models/ruta.dto';

/// Interfaz de servicio de rutas que cubre la empresa
export interface RutaService {
    getRutas(): Promise<Ruta[]>;
}
