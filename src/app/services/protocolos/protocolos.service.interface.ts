import { Protocolo } from '../../shared/prismic/models/protocolo.dto';

/// Interfaz de servicio de protocolos de bioseguridad
export interface ProtocolosService {
    getProtocolos(): Promise<Protocolo[]>;
}
