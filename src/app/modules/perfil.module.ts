import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PerfilComponent } from '../components/perfil/perfil.component';
import { PerfilServiceImpl } from '../services/perfil/perfil.service';

const routes: Routes = [
  {
    path: '',
    component: PerfilComponent,
  }
];

@NgModule({
  declarations: [
    PerfilComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  providers: [
    PerfilServiceImpl,
  ]
})
export class PerfilModule { }
