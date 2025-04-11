import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionsComponent} from './transactions.component';
import {AddTransactionComponent} from './add-transaction/add-transaction.component';


@NgModule({
  declarations: [

  ],
  providers: [],
  imports: [
    CommonModule,
    TransactionsComponent,
    AddTransactionComponent
  ]
})
export class TransactionsModule { }
