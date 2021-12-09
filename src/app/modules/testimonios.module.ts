import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TestimoniosComponent } from '../components/testimonios/testimonios.component';
import { TestimoniosServiceImpl } from '../services/testimonios/testimonios.service';

const routes: Routes = [
  {
    path: '',
    component: TestimoniosComponent,
  }
];

@NgModule({
  declarations: [
    TestimoniosComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  providers: [
    TestimoniosServiceImpl,
  ]
})
export class TestimoniosModule { }
