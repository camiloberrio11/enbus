import { Injectable } from '@angular/core';
import Prismic from 'prismic-javascript';
import { Context } from './context';
import { CONFIG } from './prismic-configuration';
import { PrismicService } from './prismic.service.interface';

@Injectable()
export class PrismicServiceImpl implements PrismicService {

    buildContext(): Promise<Context> {
        return Prismic.api(CONFIG.apiEndpoint, { accessToken: CONFIG.accessToken })
            .then((api) => {
                return {
                    api,
                    endpoint: CONFIG.apiEndpoint,
                    accessToken: CONFIG.accessToken,
                    linkResolver: CONFIG.linkResolver,
                    toolbar: this.toolbar,
                } as Context;
            });
    }

    toolbar(api) {
        const maybeCurrentExperiment = api.currentExperiment();
        if (maybeCurrentExperiment) {
            window['PrismicToolbar'].startExperiment(maybeCurrentExperiment.googleId());
        }
        window['PrismicToolbar'].setup(CONFIG.apiEndpoint);
    }
}
