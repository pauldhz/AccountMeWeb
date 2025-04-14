import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TransactionType} from '../../shared/domain/transaction/model/transaction-model';
import {toSignal} from "@angular/core/rxjs-interop";
import {TransactionServiceGateway} from "../../shared/domain/transaction/port/transaction.service.gateway";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-transactions',
  imports: [
    RouterLink,
    DatePipe,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {

  private transactionService = inject(TransactionServiceGateway);
  public transactions = toSignal(this.transactionService.getTransactions$());

  protected readonly TransactionType = TransactionType;
}
