import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.dto';
import { GlobalService } from 'src/app/services/global/global.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Viaje } from 'src/app/models/viaje.dto';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  editar = false;

  viajes: Viaje[] = [];

  userForm = new FormGroup({
    usuario: new FormControl({ value: '', disabled: true }, Validators.required),
    nombre: new FormControl({ value: '', disabled: true }, Validators.required),
    apellidos: new FormControl({ value: '', disabled: true }, Validators.required),
    documento: new FormControl({ value: '', disabled: true }, Validators.required),
    telefono: new FormControl({ value: '', disabled: true }, Validators.required),
    correo: new FormControl({ value: '', disabled: true }, Validators.required),
  });

  constructor(
    private globals: GlobalService,
    private router: Router,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    if (this.globals.usuario == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario no autenticado',
        text: 'Debes iniciar sesion para acceder a esta vista',
        confirmButtonText: 'Iniciar sesion',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        showCloseButton: false,
        showCancelButton: true,
        onClose: () => {
          this.router.navigateByUrl('/');
        }
      });
    } else {

      // this.dataService.getViajesAuth(this.globals.usuario.token).subscribe(
      //   data => {
      //     let resp;
      //     resp = data;

      //     resp.forEach(element => {
      //       this.viajes.push(element);
      //     });
      //   }
      // );

      this.userForm.setValue({
        usuario: this.globals.usuario.username,
        nombre: this.globals.usuario.first_name,
        apellidos: this.globals.usuario.last_name,
        documento: this.globals.usuario.documento,
        telefono: this.globals.usuario.telefono,
        correo: this.globals.usuario.email,
      });
    }
  }

  editarUsuario() {
    this.editar = true;

    this.userForm.controls.usuario.enable();
    this.userForm.controls.nombre.enable();
    this.userForm.controls.apellidos.enable();
    this.userForm.controls.documento.enable();
    this.userForm.controls.telefono.enable();
    this.userForm.controls.correo.enable();
  }

  cancelar() {
    this.editar = false;

    this.userForm.setValue({
      usuario: this.globals.usuario.username,
      nombre: this.globals.usuario.first_name,
      apellidos: this.globals.usuario.last_name,
      documento: this.globals.usuario.documento,
      telefono: this.globals.usuario.telefono,
      correo: this.globals.usuario.email,
    });

    this.userForm.controls.usuario.disable();
    this.userForm.controls.nombre.disable();
    this.userForm.controls.apellidos.disable();
    this.userForm.controls.documento.disable();
    this.userForm.controls.telefono.disable();
    this.userForm.controls.correo.disable();
  }

  guardar() {
    this.editar = false;
  }

}
