import {Component, Input, input, OnChanges, OnInit} from '@angular/core';
import {Transaction} from '../../../core/transaction/model/transaction-model';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: './edit-transaction.component.scss'
})
export class EditTransactionComponent implements OnChanges, OnInit {

  transaction = input.required<Transaction|undefined>();

  @Input()
  editConfirmation$!: Observable<void>;

  constructor(private formBuilder: FormBuilder) {}

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.initEditConfirmationObservation();
  }

  ngOnChanges(): void {
    this.formGroup = this.formBuilder.group({
      date: [this.transaction()?.date],
      amount: [this.transaction()?.amount],
      comment: [this.transaction()?.comment],
    })
  }

  initEditConfirmationObservation() {
    this.editConfirmation$.subscribe(
    () => console.log(`Transaction ${this.transaction()?.uuid} edited`))
  }

}
