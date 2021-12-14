/// Modelos para manejo de la información de los sliders en las diferentes secciones de la página
export class SliderInicio {
  imagen: any;
}

export class SliderPerfil {
  imagen: any;
}

export class SliderGaleria {
  imagen: any;
}

export class CardHome {
  img: {
    alt: null;
    copyright: null;
    url: string;
  };
  title: string;
  labelBtn: string;
  linkExternal?: string;
  description: string;
}

export class EmpresaAsociada {
  image_empresa: {
    dimensions: { width: number; height: number };
    alt?: any;
    copyright?: any;
    url: string;
  };
  nombre_empresa: string;
}


export class MetodosPago {
  image_card: {
    dimensions: { width: number; height: number };
    alt?: any;
    copyright?: any;
    url: string;
  };
  nombre_mostrar: string;
  nombre_api: string;
  pronto_pago: boolean;
  habilitado: boolean;
}
