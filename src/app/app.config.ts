import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {TransactionGateway} from './core/transaction/port/transaction.gateway';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {TransactionGatewayInMemory} from './core/transaction/adapter/transaction.gateway-in-memory';
import {TransactionService} from './core/transaction/adapter/transaction.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideHttpClient(withFetch()),
    { provide: TransactionGateway, useFactory: () => new TransactionService()}]
};
