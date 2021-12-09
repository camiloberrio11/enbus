import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CovidComponent } from '../components/covid/covid.component';
import { CovidServiceImpl } from '../services/covid/covid.service';

const routes: Routes = [
  {
    path: '',
    component: CovidComponent,
  }
];

@NgModule({
  declarations: [
    CovidComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  providers: [
    CovidServiceImpl,
  ],
})
export class CovidModule { }
