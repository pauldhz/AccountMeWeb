import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {TransactionServiceGateway} from './shared/domain/transaction/port/transaction.service.gateway';
import {TransactionServiceInMemory} from './shared/domain/transaction/adapter/transaction.service.in-memory.gateway';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    { provide: TransactionServiceGateway, useFactory: () => new TransactionServiceInMemory()}]
};
