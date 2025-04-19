import { Injectable } from '@angular/core';
import {TransactionServiceGateway} from '../port/transaction.service.gateway';
import {Observable, of} from 'rxjs';
import {Transaction} from '../model/transaction-model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends TransactionServiceGateway {
  override getTransactions$(): Observable<Transaction[]> {
    return of([]);
  }


}
