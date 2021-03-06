/// Modelo para manejo de la información de los viajes
export class Route {
    id: number;
    origen: string;
    destino: string;
    host?: string;
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
    enrutamiento_principal?: string;
    texto_unificado?: string;
}
