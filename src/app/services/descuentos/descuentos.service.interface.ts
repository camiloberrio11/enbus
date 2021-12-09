import { Descuento } from '../../shared/prismic/models/descuento.dto';

/// Interfaz de servicio de descuentos
export interface DescuentosService {
    getDescuentos(): Promise<Descuento[]>;
}
