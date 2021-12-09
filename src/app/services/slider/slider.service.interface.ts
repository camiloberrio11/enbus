import { SliderInicio, SliderPerfil, SliderGaleria } from '../../shared/prismic/models/slider.dto';

/// Interfaz de servicio de sliders
export interface SliderService {
    getSliderInicio(): Promise<SliderInicio[]>;
    getSliderPerfil(): Promise<SliderPerfil[]>;
    getSliderGaleria(): Promise<SliderGaleria[]>;
}
