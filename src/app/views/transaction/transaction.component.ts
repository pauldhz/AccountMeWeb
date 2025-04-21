import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Transaction, TransactionType} from '../../core/transaction/model/transaction-model';
import {toSignal} from "@angular/core/rxjs-interop";
import {TransactionServiceGateway} from "../../core/transaction/port/transaction.service.gateway";
import {CommonModule, DatePipe} from "@angular/common";
import {DialogComponent} from '../common/dialog/dialog.component';
import {EditTransactionComponent} from './edit-transaction/edit-transaction.component';

@Component({
  selector: 'app-transaction',
  imports: [
    RouterLink,
    DatePipe,
    CommonModule,
    DialogComponent,
    EditTransactionComponent
  ],
  templateUrl: './transaction.component.html',
  standalone: true,
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent {

  private transactionService = inject(TransactionServiceGateway);

  transactions = toSignal(this.transactionService.getTransactions$());
  transactionSelectedForEdition: Transaction | null = null;

  affectTransactionForEdition(transaction: Transaction): void {
    this.transactionSelectedForEdition = transaction;
  }

  editTransaction(transaction: Transaction|null) {
    if(transaction !== null) {
      // Edit transaction ...
    }
    this.transactionSelectedForEdition = null;
  }

  protected readonly TransactionType = TransactionType;
}
