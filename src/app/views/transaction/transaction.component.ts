import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TransactionType} from '../../core/transaction/model/transaction-model';
import {toSignal} from "@angular/core/rxjs-interop";
import {TransactionServiceGateway} from "../../core/transaction/port/transaction.service.gateway";
import {CommonModule, DatePipe} from "@angular/common";

@Component({
  selector: 'app-transaction',
  imports: [
    RouterLink,
    DatePipe,
    CommonModule
  ],
  templateUrl: './transaction.component.html',
  standalone: true,
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent {

  private transactionService = inject(TransactionServiceGateway);
  public transactions = toSignal(this.transactionService.getTransactions$());

  protected readonly TransactionType = TransactionType;
}
