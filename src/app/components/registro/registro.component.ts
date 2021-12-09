import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registroForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    documento: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    check_tyc: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.authService.registro(
      this.registroForm.value.username,
      this.registroForm.value.first_name,
      this.registroForm.value.last_name,
      this.registroForm.value.email,
      this.registroForm.value.documento,
      this.registroForm.value.telefono,
      this.registroForm.value.password,
    ).subscribe(
      data => {
        let resp;
        resp = data;

        if (resp.username != null) {
          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: false,
            icon: 'success',
            title: 'Usuario registrado correctamente',
            // text: 'A continuación serás redirigido al sitio de pago.',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigateByUrl('/inicio');
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
