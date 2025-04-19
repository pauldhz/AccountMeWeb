import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {TransactionServiceGateway} from '../port/transaction.service.gateway';
import {Transaction, TransactionType} from '../model/transaction-model';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TransactionServiceInMemoryMax extends TransactionServiceGateway {


  getTransactions$(): Observable<any> {
    return of(this.listOfTransactions());
  }

  private listOfTransactions(){
    let transactions = [];
    for (let i = 0; i < 10; i++) {
      transactions.push(this.generateTransaction(i));
    }
    return transactions;
  }

  private generateTransaction(i: number): Transaction {
    let type: TransactionType = TransactionType.CREDIT;
    let randomInt = Math.round(Math.random() * 10);
    if(i % 4 == 0){
      randomInt = -randomInt;
      type = TransactionType.DEBIT;
    }
    return {
      uuid: uuidv4(),
      date: new Date(),
      amount: 10 + (i * randomInt),
      type: type,
      comment: 'In-Memory Transaction ' + i,
      additionalInformation: {
        category: 'Test',
        subcategory: 'SubTest',
        accountTitle: 'Account Title',
        internalTransfer: i % 3 == 0
      }
    }
  }
}
