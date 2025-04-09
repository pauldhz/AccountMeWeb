import {Component, inject, Signal} from '@angular/core';
import {TransactionServiceGateway} from '../../shared/domain/transaction/port/transaction.service.gateway';
import {AsyncPipe} from '@angular/common';
import {Transaction} from '../../shared/domain/transaction/model/transaction-model';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent {

  private transactionServiceGateway = inject(TransactionServiceGateway);

  public transactions = toSignal(this.transactionServiceGateway.getTransactions$());


}
