import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TransactionServiceGateway} from './transaction.service.gateway';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends TransactionServiceGateway{

  private http = inject(HttpClient);

  listAll$(): Observable<any> {
    return this.http.get('http://localhost:8081/account-me/transactions');
  }
}
