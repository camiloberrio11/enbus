/// Interfaz para manejo de contexto del servicio de prismic
export interface Context {
    api: any;
    endpoint: string;
    accessToken?: string;
    linkResolver: Function;
    toolbar: Function;
}