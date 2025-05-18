import {Component, inject, input, signal, WritableSignal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Transaction, TransactionType} from '../../core/transaction/model/transaction-model';
import {toSignal} from "@angular/core/rxjs-interop";
import {TransactionServiceGateway} from "../../core/transaction/port/transaction.service.gateway";
import {CommonModule, DatePipe} from "@angular/common";
import {DialogComponent} from '../../shared/component/dialog/dialog.component';
import {EditTransactionComponent} from './edit-transaction/edit-transaction.component';
import {BehaviorSubject, switchMap} from 'rxjs';
import {ImportTransactionComponent} from './import-transaction/import-transaction.component';
import {CsvUtils} from '../../utils/csv-utils';

@Component({
  selector: 'app-transaction',
  imports: [
    RouterLink,
    DatePipe,
    CommonModule,
    DialogComponent,
    EditTransactionComponent,
    ImportTransactionComponent
  ],
  templateUrl: './transaction.component.html',
  standalone: true,
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent {

  public targets = ['Date', 'Montant', 'Type', 'Commentaire', 'Informations additionnelles'];
  public options = ['Test 1', 'Another test'];

  private transactionService = inject(TransactionServiceGateway);
  private reload$$ = this.transactionService.reload$$();
  transactionNotifier$$ = new BehaviorSubject<void>(undefined);


  constructor() {}

  transactions = toSignal(this.reload$$.pipe(switchMap(() => this.transactionService.getTransactions$())));
  transactionSelectedForEdition: WritableSignal<Transaction | undefined> = signal(undefined);
  importAsCSVOpened = signal(false);
  csvUploadedHeader: WritableSignal<string[]> = signal([]);


  affectTransactionForEdition(transaction: Transaction): void {
    this.transactionSelectedForEdition.set(transaction)
  }

  editTransaction(editionConfirmed: boolean) {
    if (editionConfirmed) {
      this.transactionNotifier$$.next();
    }
    this.transactionSelectedForEdition.set(undefined);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files?.length > 0) {
      const file: File | null = input.files[0] ?? null;
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        this.csvUploadedHeader.set(CsvUtils.getHeader(fileContent, ";"));
        this.importAsCSVOpened.set(true);
      }
      reader.readAsText(file);
    }
  }

  protected readonly TransactionType = TransactionType;
  protected readonly signal = signal;
}
