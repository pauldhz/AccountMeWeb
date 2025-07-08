import {inject, Injectable} from '@angular/core';
import {TransactionGateway} from '../port/transaction.gateway';
import {Observable} from 'rxjs';
import {Transaction, TransactionsResponse} from '../model/transaction-model';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends TransactionGateway {

  private headers = new HttpHeaders().set('Accept', 'application/json');

  private baseUri: string = '/account-me/';

  private http = inject(HttpClient);

  override getTransactions$(link?: string): Observable<TransactionsResponse> {
    const uri = link ? this.baseUri + link : this.baseUri + 'transactions';
    const result = this.http.get<TransactionsResponse>(uri,
      { headers: this.headers });
    result.subscribe(res => console.log(res));
    return result;
  }

  updateTransaction$(transaction: Transaction): Observable<boolean> {
    return this.http.put<boolean>('/account-me/transactions', transaction, { headers : this.headers});
  }

  saveTransactions$(transactions: Transaction[]): Observable<boolean> {
    return this.http.post<boolean>('/account-me/transactions', transactions, { headers : this.headers});
  }

}
