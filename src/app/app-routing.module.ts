import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { ContactoComponent } from './components/contacto/contacto.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { ListaViajesComponent } from './components/lista-viajes/lista-viajes.component';
import { ListaViajesVueltaComponent } from './components/lista-viajes-vuelta/lista-viajes-vuelta.component';
import { DatosPasajeroComponent } from './components/datos-pasajero/datos-pasajero.component';

/// Rutas que utiliza la aplicación
const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: 'contacto',
    loadChildren: () => import('./modules/contacto.module').then(m => m.ContactoModule),
  },
  {
    path: 'obligaciones-pasajero',
    loadChildren: () => import('./modules/obligaciones-pasajero.module').then(m => m.ObligacionesPasajeroModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./modules/faq.module').then(m => m.FaqModule),
  },
  {
    path: 'historia',
    loadChildren: () => import('./modules/historia.module').then(m => m.HistoriaModule),
  },
  {
    path: 'perfil',
    loadChildren: () => import('./modules/perfil.module').then(m => m.PerfilModule),
  },
  {
    path: 'servicios',
    loadChildren: () => import('./modules/servicios.module').then(m => m.ServiciosModule),
  },
  {
    path: 'testimonios',
    loadChildren: () => import('./modules/testimonios.module').then(m => m.TestimoniosModule),
  },
  {
    path: 'descuentos',
    loadChildren: () => import('./modules/descuentos.module').then(m => m.DescuentosModule),
  },
  {
    path: 'lista-viajes/',
    // path: 'lista-viajes/:origen:destino:fecha',
    component: ListaViajesComponent,
  },
  {
    path: 'lista-viajes-vuelta/',
    // path: 'lista-viajes-vuelta/:origen:destino:fecha',
    component: ListaViajesVueltaComponent,
  },
  {
    path: 'datos-pasajero',
    component: DatosPasajeroComponent,
  },
  {
    path: 'documentos',
    component: DocumentosComponent,
  },

  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'registro',
    loadChildren: () => import('./modules/registro/registro.module').then(m => m.RegistroModule),
  },
  {
    path: 'mis-viajes',
    loadChildren: () => import('./modules/mis-viajes.module').then(m => m.MisViajesModule),
  },
  {
    path: 'protocolos',
    loadChildren: () => import('./modules/protocolos.module').then(m => m.ProtocolosModule),
  },
  {
    path: 'usuario',
    loadChildren: () => import('./modules/usuario.module').then(m => m.UsuarioModule),
  },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
