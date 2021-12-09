import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.dto';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private globals: GlobalService,
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    // console.log(this.loginForm.value);
    this.authService.login(
      this.loginForm.value.username,
      this.loginForm.value.password,
    ).subscribe(
      data => {
        let resp;
        resp = data;

        if (resp.token != null) {

          localStorage.setItem('usuario', JSON.stringify(resp));

          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: false,
            icon: 'success',
            title: `Bienvenido ${resp.first_name} ${resp.last_name}`,
            // text: 'A continuación serás redirigido al sitio de pago.',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            localStorage.setItem('usuario', JSON.stringify(resp));
            this.globals.usuario = resp;
            this.router.navigateByUrl('/inicio');
          });
        }
      }
    );
  }

}
