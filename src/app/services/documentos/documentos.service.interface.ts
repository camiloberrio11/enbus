import { Documento } from '../../shared/prismic/models/documento.dto';

/// Interfaz de servicio de documentos
export interface DocumentosService {
    getDocumentos(): Promise<Documento[]>;
}
