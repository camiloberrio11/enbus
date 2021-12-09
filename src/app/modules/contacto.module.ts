import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ContactoComponent } from '../components/contacto/contacto.component';
import { ContactoServiceImpl } from '../services/contacto/contacto.service';

const routes: Routes = [
  {
    path: '',
    component: ContactoComponent,
  }
];

@NgModule({
  declarations: [
    ContactoComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  providers: [
    ContactoServiceImpl,
  ],
})
export class ContactoModule { }
