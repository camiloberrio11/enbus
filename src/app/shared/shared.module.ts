import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismicServiceImpl } from './prismic/prismic.service';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  providers: [
    { provide: 'PrismicService', useClass: PrismicServiceImpl },
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
