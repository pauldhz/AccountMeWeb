import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TransactionServiceGateway} from "../port/transaction.service.gateway";

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends TransactionServiceGateway{

  private http = inject(HttpClient);

  getTransactions$(): Observable<any> {
    return this.http.get('/account-me/transactions');
  }
}
