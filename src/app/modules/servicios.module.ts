import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ServiciosComponent } from '../components/servicios/servicios.component';
import { RutasServiceImpl } from '../services/rutas/rutas.service';

const routes: Routes = [
  {
    path: '',
    component: ServiciosComponent,
  }
];

@NgModule({
  declarations: [
    ServiciosComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  providers: [
    RutasServiceImpl,
  ]
})
export class ServiciosModule { }
