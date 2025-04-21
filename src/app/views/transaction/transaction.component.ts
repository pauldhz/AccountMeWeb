import {Component, inject, signal, WritableSignal} from '@angular/core';
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
  transactionSelectedForEdition: WritableSignal<Transaction|undefined> = signal(undefined);

  affectTransactionForEdition(transaction: Transaction): void {
    this.transactionSelectedForEdition.set(transaction)
  }

  editTransaction(transaction: WritableSignal<Transaction|undefined>) {
    if(transaction() !== undefined) {
      // Edit transaction ...
    }
    this.transactionSelectedForEdition.set(undefined);
  }

  protected readonly TransactionType = TransactionType;
}
