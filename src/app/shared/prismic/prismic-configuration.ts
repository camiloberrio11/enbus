/// Interfaz de configuración del servicio de prismic
export interface PrismicConfiguration {
  apiEndpoint: string;
  accessToken?: string;
  linkResolver: Function;
}

export const CONFIG: PrismicConfiguration = {
  apiEndpoint: 'https://flota-ospina.cdn.prismic.io/api/v2',
  accessToken: 'MC5YdDBKckJBQUFCNEFSeHNr.77-9Uu-_ve-_vT0LXknvv71gfxvvv71deFTvv73vv73vv71YN--_vVIq77-9NXXvv70i77-977-9Wg',

  linkResolver() {
    return '/';
  }
};
