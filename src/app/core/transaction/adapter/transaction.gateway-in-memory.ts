import {TransactionGateway} from '../port/transaction.gateway';
import {Observable, of} from 'rxjs';
import {Links, Metadata, Transaction, TransactionsResponse, TransactionType} from '../model/transaction-model';

export class TransactionGatewayInMemory extends TransactionGateway {

  private transactions: Transaction[] = [
    {
      id: '4516de03-3241-45b0-a3ad-bfe598259b0b',
      date: new Date(),
      amount: 20.00,
      type: TransactionType.DEBIT,
      label: 'Amazon',
      comment: 'no comment for this debit'
    },
    {
      id: '02e07ddc-e9c7-4283-9343-a9bd3f2a0301',
      date: new Date(),
      amount: 30.00,
      label: 'Amazon',
      type: TransactionType.DEBIT,
      comment: 'it is too much'
    },
    {
      id: '8cdfb38a-0dc7-4100-8de1-f9a9628eb086',
      date: new Date(),
      amount: 15.45,
      label: 'Amazon',
      type: TransactionType.CREDIT,
      comment: 'no comment for this credit'
    },
  ];

  private links: Links = {
    first: "",
    next: "",
    last: "",
    prev: "",
    nNextLinks: {"": ""}
  }

  private metadata: Metadata = {
    currentPageNumber: 1
  }

  public withTransactions(transactions: Transaction[]): TransactionGatewayInMemory {
    this.transactions = transactions;
    return this;
  }

  public withLinks(links: Links): TransactionGatewayInMemory {
    this.links = links;
    return this;
  }

  private transactionResponse$(): Observable<TransactionsResponse> {
    return of({
      transactions: this.transactions,
      links: this.links,
      metadata: this.metadata
    });
  }

  override getTransactions$(links?: string): Observable<TransactionsResponse> {
    return this.transactionResponse$();
  }

  override updateTransaction$(transaction: Transaction): Observable<boolean> {
    const arrayCopy = [...this.transactions];
    const index = arrayCopy.findIndex(tmpTransaction => transaction.id == tmpTransaction.id);
    arrayCopy[index] = transaction;
    this.transactions = JSON.parse(JSON.stringify(arrayCopy));
    return of(true);
  }

  saveTransactions$(transactions: Transaction[]): Observable<boolean> {
    return of(true);
  }
}
