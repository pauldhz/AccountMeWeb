import {BehaviorSubject, Observable} from 'rxjs';
import {Transaction, TransactionsResponse} from '../model/transaction-model';

export abstract class TransactionGateway {

  private _reload$$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  public abstract getTransactions$(link?: string): Observable<TransactionsResponse>;

  public abstract updateTransaction$(transaction: Transaction): Observable<boolean>;

  public abstract saveTransactions$(transactions: Transaction[]): Observable<boolean>;

  public reload$$(transactionUri?: string):BehaviorSubject<string | undefined> {
    return this._reload$$;
  }
}
