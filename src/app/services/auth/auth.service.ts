import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private endpointService: EndpointService,
  ) { }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', `Token ${token}`);
  }

  login(username: string, password: string) {
    return this.http.post(
      this.endpointService.getEndpoint + 'login',
      {
        username,
        password,
      }
    );
  }

  registro(
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    documento: string,
    telefono: string,
    password: string,
  ) {
    return this.http.post(
      this.endpointService.getEndpoint + 'pasajero/',
      {
        username,
        first_name,
        last_name,
        email,
        documento,
        telefono,
        password,
      }
    );
  }
}
