import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MisViajesComponent } from '../components/mis-viajes/mis-viajes.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: MisViajesComponent,
  }
];

@NgModule({
  declarations: [
    MisViajesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MisViajesModule { }
