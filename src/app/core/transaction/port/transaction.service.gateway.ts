import {Observable} from 'rxjs';
import {Transaction} from '../model/transaction-model';

export abstract class TransactionServiceGateway {
  public abstract getTransactions$(): Observable<Transaction[]>;
}
