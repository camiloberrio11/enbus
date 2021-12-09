import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DocumentosComponent } from '../components/documentos/documentos.component';
import { DocumentosServiceImpl } from '../services/documentos/documentos.service';

const routes: Routes = [
  {
    path: '',
    component: DocumentosComponent,
  }
];

@NgModule({
  declarations: [
    DocumentosComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  providers: [
    DocumentosServiceImpl,
  ],
})
export class DocumentosModule { }
