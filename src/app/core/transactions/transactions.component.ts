import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Transaction} from '../../shared/domain/transaction/model/transaction-model';
import {
  TransactionServiceInMemory
} from '../../shared/domain/transaction/services/transaction.service.in-memory.gateway';

@Component({
  selector: 'app-transactions',
  imports: [
    RouterLink
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {

  public transactions: Transaction[] | undefined;

  constructor(private transactionService: TransactionServiceInMemory) {
  }

  ngOnInit() {
    this.transactionService.listAll$().subscribe(transactions => {
      console.log("All transactions:", transactions);
      this.transactions = transactions;
    });
  }

}
