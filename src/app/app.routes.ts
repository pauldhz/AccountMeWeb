import { Routes } from '@angular/router';
import {AddTransactionComponent} from './views/transaction/add-transaction/add-transaction.component';
import {TransactionComponent} from './views/transaction/transaction.component';

export const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionComponent,
    children: [
      {
        path: 'add',
        component: AddTransactionComponent
      }
    ]
  }
];
