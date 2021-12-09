import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { Usuario } from 'src/app/models/usuario.dto';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

/**
 * Componente dedicado para el header
 */
export class HeaderComponent implements OnInit {

  username: string;
  password: string;

  usuario: Usuario = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    public globals: GlobalService,
  ) { }

  ngOnInit() {

    if (localStorage.getItem('usuario') != null) {
      this.globals.usuario = JSON.parse(localStorage.getItem('usuario'));
    }

    this.usuario = this.globals.usuario;
  }

  login() {
    Swal.fire({
      icon: 'info',
      title: 'Ingresar',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#dc3545',
      allowOutsideClick: false,
      showCloseButton: true,
      allowEnterKey: true,
      html:
        '<div class="form-group row m-2">' +
        '<input class="form-control" id="usernameField" type="text" placeholder="Usario">' +
        '</div>' +
        '<div class="form-group row m-2">' +
        '<input class="form-control" id="passwordField" type="password" placeholder="Contraseña">' +
        '</div>',
      preConfirm: () => {
        this.username = $('#usernameField').val().toString();
        this.password = $('#passwordField').val().toString();

        this.authService.login(
          this.username,
          this.password
        ).subscribe(
          data => {
            let resp;
            resp = data;

            if (resp.first_name != null) {
              this.globals.usuario = resp;
              this.usuario = this.globals.usuario;

              localStorage.setItem('usuario', JSON.stringify(this.usuario));

              Swal.fire({
                icon: 'success',
                title: `Bienvenido ${resp.first_name} ${resp.last_name}`,
                text: 'Sesión iniciada correctamente',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'No se ha podido iniciar sesión',
                text: 'Verifica que los datos sean los correctos',
              });
            }
          },

          err => {
            Swal.fire({
              icon: 'error',
              title: 'No se ha podido iniciar sesión',
              text: 'Verifica que los datos sean los correctos',
            });
            console.log(err);
          }
        );
      },
    });
  }

  logout() {
    Swal.fire({
      icon: 'info',
      title: 'Tu sesión será cerrada',
      text: '¿Estás seguro que deseas continuar?',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm: () => {

        this.usuario = null;
        this.globals.usuario = null;

        localStorage.removeItem('usuario');
        Swal.fire({
          icon: 'success',
          title: '¡Vuelve pronto!',
          text: 'Sesión cerrada con exito',
          confirmButtonText: 'Aceptar',
          showCancelButton: false,
        });

      },
    });

  }

  registro() {

    Swal.fire({
      icon: 'info',
      title: 'Serás dirigido a la página de registro',
      text: '¿Estás seguro que deseas continuar?',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm: () => {
        this.router.navigateByUrl('/registro');
      },
    });
  }
}
