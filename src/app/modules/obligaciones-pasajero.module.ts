import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ObligacionesPasajeroComponent } from '../components/obligaciones-pasajero/obligaciones-pasajero.component';
import { ObligacionesPasajeroServiceImpl } from '../services/obligaciones-pasajero/obligaciones-pasajero.service';

const routes: Routes = [
  {
    path: '',
    component: ObligacionesPasajeroComponent,
  }
];

@NgModule({
  declarations: [
    ObligacionesPasajeroComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ObligacionesPasajeroServiceImpl,
  ],
})
export class ObligacionesPasajeroModule { }
