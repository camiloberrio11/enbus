import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HistoriaComponent } from '../components/historia/historia.component';
import { HistoriaServiceImpl } from '../services/historia/historia.service';

const routes: Routes = [
  {
    path: '',
    component: HistoriaComponent,
  }
];

@NgModule({
  declarations: [
    HistoriaComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  providers: [
    HistoriaServiceImpl,
  ]
})
export class HistoriaModule { }
