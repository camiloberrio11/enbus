import { PopupInicio } from '../../shared/prismic/models/popup-inicio.dto';

/// Interfaz de servicio de inicio
export interface InicioService {
    getPopupInicio(): Promise<PopupInicio>;
}
