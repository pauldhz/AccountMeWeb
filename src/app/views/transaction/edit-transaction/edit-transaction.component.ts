import {Component, input, OnChanges} from '@angular/core';
import {Transaction} from '../../../core/transaction/model/transaction-model';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: './edit-transaction.component.scss'
})
export class EditTransactionComponent implements OnChanges {

  transaction = input.required<Transaction|undefined>();

  constructor(private formBuilder: FormBuilder) {}

  formGroup!: FormGroup;

  ngOnChanges(): void {
    this.formGroup = this.formBuilder.group({
      date: [this.transaction()?.date],
      amount: [this.transaction()?.amount],
      comment: [this.transaction()?.comment],
    })
  }

}
