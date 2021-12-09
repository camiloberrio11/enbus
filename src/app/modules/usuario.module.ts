import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioComponent } from '../components/usuario/usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: UsuarioComponent,
  }
];

@NgModule({
  declarations: [
    UsuarioComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UsuarioModule { }
