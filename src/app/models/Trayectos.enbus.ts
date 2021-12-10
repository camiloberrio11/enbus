export interface DisponibilidadRuta {
  data: {
    host: string;
    id: number;
    origen: string;
    destino: string;
    hora: string;
    fecha: string;
    precio_primera_clase: string;
    precio_segunda_clase: string;
    mapa_asientos_primero: string;
    mapa_asientos_segundo: string;
    empresa: string;
    tipo_vehiculo: string;
    imagen_ruta: string;
    logo_empresa: string;
    disponible: string;
    ocupado: string[];
    texto_unificado: string;
    enrutamiento_principal: string;
  }[];
}
