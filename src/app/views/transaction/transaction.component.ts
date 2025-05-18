import {Component, ElementRef, inject, input, signal, ViewChild, WritableSignal} from '@angular/core';
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

  private transactionService = inject(TransactionServiceGateway);
  private reload$$ = this.transactionService.reload$$();
  transactionNotifier$$ = new BehaviorSubject<void>(undefined);

  @ViewChild('inputFile') inputFile! : ElementRef<HTMLInputElement>;

  transactions = toSignal(this.reload$$.pipe(switchMap(() => this.transactionService.getTransactions$())));
  transactionSelectedForEdition: WritableSignal<Transaction | undefined> = signal(undefined);
  importAsCSVOpened = signal(false);
  filename: WritableSignal<string> = signal('');
  csvUploadedHeader: WritableSignal<string[]> = signal([]);

  constructor() {}

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
        this.filename.set(file.name);
        this.importAsCSVOpened.set(true);
      reader.onload = () => {
        const fileContent = reader.result as string;
        this.csvUploadedHeader.set(CsvUtils.getHeader(fileContent, ";"));
      }
      reader.readAsText(file);
    }
  }

  onClose() {
    this.importAsCSVOpened.set(false);
    this.inputFile.nativeElement.value = '';
    this.filename.set('');
  }

  protected readonly TransactionType = TransactionType;
  protected readonly signal = signal;
}
