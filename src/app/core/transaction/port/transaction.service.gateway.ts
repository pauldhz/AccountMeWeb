import {BehaviorSubject, Observable} from 'rxjs';
import {Transaction} from '../model/transaction-model';

export abstract class TransactionServiceGateway {

  private _reload$$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  public abstract getTransactions$(): Observable<Transaction[]>;

  public abstract updateTransaction$(transaction: Transaction): Observable<boolean>;

  public reload$$():BehaviorSubject<void> {
    return this._reload$$;
  }
}
