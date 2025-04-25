import {inject, Injectable} from '@angular/core';
import {TransactionServiceGateway} from '../port/transaction.service.gateway';
import {Observable, of} from 'rxjs';
import {Transaction} from '../model/transaction-model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends TransactionServiceGateway {

  private http = inject(HttpClient);

  override getTransactions$(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/account-me/transactions');
  }



}
