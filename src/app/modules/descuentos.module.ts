import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DescuentosComponent } from '../components/descuentos/descuentos.component';

const routes: Routes = [
  {
    path: '',
    component: DescuentosComponent,
  }
];

@NgModule({
  declarations: [
    DescuentosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class DescuentosModule { }
