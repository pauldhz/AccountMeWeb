import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {TransactionServiceGateway} from './core/transaction/port/transaction.service.gateway';
import {provideHttpClient} from '@angular/common/http';
import {TransactionServiceInMemory} from './core/transaction/adapter/transaction.service.in-memory.gateway';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideHttpClient(),
    { provide: TransactionServiceGateway, useFactory: () => new TransactionServiceInMemory()}]
};
