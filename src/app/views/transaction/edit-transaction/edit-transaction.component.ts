import {Component, effect, inject, Input, input, OnInit} from '@angular/core';
import {Transaction} from '../../../core/transaction/model/transaction-model';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Observable, tap} from 'rxjs';
import {TransactionServiceGateway} from '../../../core/transaction/port/transaction.service.gateway';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: './edit-transaction.component.scss'
})
export class EditTransactionComponent implements OnInit {

  transaction = input.required<Transaction|undefined>();

  private transactionService = inject(TransactionServiceGateway);

  @Input()
  editConfirmation$!: Observable<void>;

  constructor(private formBuilder: FormBuilder) {
    effect(() => {
      this.formGroup.patchValue({
        comment: this.transaction()?.comment,
        amount: this.transaction()?.amount,
        date: this.transaction()?.date
      })
    });
  }

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.initEditConfirmationObservation();
    this.formGroup = this.formBuilder.group({
      date: '',
      amount: 0,
      comment: ''
    });
  }

  initEditConfirmationObservation() {
    this.editConfirmation$.subscribe(
    () => {
      if(!this.formGroup) {
        return;
      }
      this.transactionService.updateTransaction$({... this.formGroup.value, id: this.transaction()?.id, type: this.transaction()?.type})
        .pipe(tap(() => this.transactionService.reload$$().next())).subscribe();
    });
  }
}
