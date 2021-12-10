/// Interfaz de configuración del servicio de prismic
export interface PrismicConfiguration {
  apiEndpoint: string;
  accessToken?: string;
  linkResolver: Function;
}

export const CONFIG: PrismicConfiguration = {

  apiEndpoint: 'https://sideral.cdn.prismic.io/api/v2',
  accessToken: 'MC5ZRjNuUGhJQUFDSUFLaTRD.WO-_vVJ0XmPvv70WA--_vVgkCA0N77-9Xu-_ve-_vTBSIkZe77-9QQ5BBRPvv70V',

  // apiEndpoint: 'https://enbus.cdn.prismic.io/api/v2',
  // accessToken: 'MC5YMG1qR2hJQUFCajRWYkRD.77-9WlXvv70d77-9Yu-_vSJqU--_vVp677-9N--_vQjvv70N77-977-977-9UO-_vXxy77-977-9ZV4L',


  linkResolver() {
    return '/';
  }
};
