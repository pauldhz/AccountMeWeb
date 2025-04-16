import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {TransactionServiceGateway} from './shared/domain/transaction/port/transaction.service.gateway';
import {TransactionService} from './shared/domain/transaction/services/transaction.service';
import {provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideHttpClient(),
    { provide: TransactionServiceGateway, useFactory: () => new TransactionService()}]
};
