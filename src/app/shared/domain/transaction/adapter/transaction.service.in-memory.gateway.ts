import {TransactionServiceGateway} from '../port/transaction.service.gateway';
import {Observable, of} from 'rxjs';
import {Transaction, TransactionType} from '../model/transaction-model';

export class TransactionServiceInMemory extends TransactionServiceGateway {

  private transactions: Transaction[] = [
    {
      uuid: '4516de03-3241-45b0-a3ad-bfe598259b0b',
      date: new Date(),
      amount: 20.00,
      type: TransactionType.DEBIT,
      comment: 'no comment for this debit'
    },
    {
      uuid: '02e07ddc-e9c7-4283-9343-a9bd3f2a0301',
      date: new Date(),
      amount: 30.00,
      type: TransactionType.DEBIT,
      comment: 'it is too much'
    },
    {
      uuid: '8cdfb38a-0dc7-4100-8de1-f9a9628eb086',
      date: new Date(),
      amount: 15.45,
      type: TransactionType.CREDIT,
      comment: 'no comment for this credit'
    },
  ];

  override getTransactions$(): Observable<Transaction[]> {
    return of(this.transactions);
  }

}
