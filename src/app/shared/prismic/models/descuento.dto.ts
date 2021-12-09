/// Modelo para manejo de los descuentos mostrados en la página
export class Descuento {
    nombre: string;
    informacion: InfoDescuento[];
    icono: any;
}

export class InfoDescuento {
    type: string;
    text: string;
    spans: any[];
}
