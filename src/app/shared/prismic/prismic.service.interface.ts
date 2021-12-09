import { Context } from './context';

/// Interfaz de servicio de prismic
export interface PrismicService {
    buildContext(): Promise<Context>;
}
