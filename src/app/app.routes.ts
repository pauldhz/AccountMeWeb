import { Routes } from '@angular/router';
import {AddTransactionComponent} from './core/transactions/add-transaction/add-transaction.component';
import {TransactionsComponent} from './core/transactions/transactions.component';

export const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionsComponent,
    children: [
      {
        path: 'add',
        component: AddTransactionComponent
      }
    ]
  }
];
