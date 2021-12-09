import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProtocolosComponent } from '../components/protocolos/protocolos.component';
import { ProtocolosServiceImpl } from '../services/protocolos/protocolos.service';

const routes: Routes = [
  {
    path: '',
    component: ProtocolosComponent,
  }
];

@NgModule({
  declarations: [
    ProtocolosComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  providers: [
    ProtocolosServiceImpl,
  ],
})
export class ProtocolosModule { }
