import { Injectable } from '@angular/core';
import { Context } from './context';
import { PrismicService } from './prismic.service.interface';

/// Servicio de prismic
@Injectable()
export class PrismicServiceImpl implements PrismicService {

    buildContext(): Promise<Context> {
        return new Promise<Context>((resolve) => {
            resolve();
        });
    }
}
