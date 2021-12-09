import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from '../components/faq/faq.component';
import { FaqServiceImpl } from '../services/faq/faq.service';

const routes: Routes = [
  {
    path: '',
    component: FaqComponent,
  }
];

@NgModule({
  declarations: [
    FaqComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  providers: [
    FaqServiceImpl,
  ]
})
export class FaqModule { }
