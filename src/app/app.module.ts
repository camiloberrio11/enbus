import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { InicioComponent } from './components/inicio/inicio.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ListaViajesComponent } from './components/lista-viajes/lista-viajes.component';
import { ListaViajesVueltaComponent } from './components/lista-viajes-vuelta/lista-viajes-vuelta.component';
import { DatosPasajeroComponent } from './components/datos-pasajero/datos-pasajero.component';

import { WebsocketsService } from './services/websockets/websockets.service';
import { DataService } from './services/data/data.service';
import { SliderServiceImpl } from './services/slider/slider.service';

import { Globals } from './common/globals';
import { ContactoModule } from './modules/contacto.module';
import { CovidModule } from './modules/covid.module';
import { DocumentosModule } from './modules/documentos.module';
import { FaqModule } from './modules/faq.module';
import { HistoriaModule } from './modules/historia.module';
import { PerfilModule } from './modules/perfil.module';
import { ServiciosModule } from './modules/servicios.module';
import { TestimoniosModule } from './modules/testimonios.module';

import * as Sentry from '@sentry/browser';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { LoginModule } from './modules/login/login.module';
import { RegistroModule } from './modules/registro/registro.module';
import { MisViajesModule } from './modules/mis-viajes.module';
import { GlobalService } from './services/global/global.service';
import { ObligacionesPasajeroModule } from './modules/obligaciones-pasajero.module';
import { DescuentosModule } from './modules/descuentos.module';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { UsuarioModule } from './modules/usuario.module';
import { ProtocolosModule } from './modules/protocolos.module';
import { DateTimePipe } from './pipes/date-time.pipe';

Sentry.init({
  dsn: 'https://9434cadcd9c64120acac8fa426a927fa@o366284.ingest.sentry.io/5373504',
  // TryCatch has to be configured to disable XMLHttpRequest wrapping, as we are going to handle
  // http module exceptions manually in Angular's ErrorHandler and we don't want it to capture the same error twice.
  // Please note that TryCatch configuration requires at least @sentry/browser v5.16.0.
  integrations: [new Sentry.Integrations.TryCatch({
    XMLHttpRequest: false,
  })],
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() { }

  extractError(error) {
    // Try to unwrap zone.js error.
    // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
    if (error && error.ngOriginalError) {
      error = error.ngOriginalError;
    }

    // We can handle messages and Error objects directly.
    if (typeof error === 'string' || error instanceof Error) {
      return error;
    }

    // If it's http module error, extract as much information from it as we can.
    if (error instanceof HttpErrorResponse) {
      // The `error` property of http exception can be either an `Error` object, which we can use directly...
      if (error.error instanceof Error) {
        return error.error;
      }

      // ... or an`ErrorEvent`, which can provide us with the message but no stack...
      if (error.error instanceof ErrorEvent) {
        return error.error.message;
      }

      // ...or the request body itself, which we can use as a message instead.
      if (typeof error.error === 'string') {
        return `Server returned code ${error.status} with body "${error.error}"`;
      }

      // If we don't have any detailed information, fallback to the request message itself.
      return error.message;
    }

    // Skip if there's no error, and let user decide what to do with it.
    return null;
  }

  handleError(error) {
    const extractedError = this.extractError(error) || 'Handled unknown error';

    // Capture handled exception and send it to Sentry.
    const eventId = Sentry.captureException(extractedError);

    // When in development mode, log the error to console for immediate feedback.
    if (!environment.production) {
      console.error(extractedError);
    }

    // Optionally show user dialog to provide details on what happened.
    Sentry.showReportDialog({ eventId });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    FooterComponent,
    HeaderComponent,
    ListaViajesComponent,
    DatosPasajeroComponent,
    ListaViajesVueltaComponent,
    DateTimePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule.forRoot(),

    MatDatepickerModule,
    MatNativeDateModule,

    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,

    ContactoModule,
    CovidModule,
    DocumentosModule,
    FaqModule,
    HistoriaModule,
    PerfilModule,
    ServiciosModule,
    TestimoniosModule,
    LoginModule,
    RegistroModule,
    MisViajesModule,
    ObligacionesPasajeroModule,
    DescuentosModule,
    UsuarioModule,
    ProtocolosModule,
  ],
  providers: [
    DatePipe,
    SliderServiceImpl,
    WebsocketsService,
    DataService,
    Globals,
    GlobalService,
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
