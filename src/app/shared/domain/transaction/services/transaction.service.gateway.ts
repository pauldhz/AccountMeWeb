import {Observable} from 'rxjs';

export abstract class TransactionServiceGateway {
  public abstract listAll$(): Observable<any>;
}
