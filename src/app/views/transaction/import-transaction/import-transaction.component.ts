import {Component, computed, effect, Input, input, OnInit, Signal, signal} from '@angular/core';

import {KeyValuePipe, NgClass} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {Group, GroupBuilder} from '../../../utils/mapping/group-builder';
import {Transaction, TransactionType} from '../../../core/transaction/model/transaction-model';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import {TransactionServiceGateway} from '../../../core/transaction/port/transaction.service.gateway';

export enum AmountType {
  TYPED, SIGNED, CREDITDEBIT
}

@Component({
  selector: 'app-import-transaction',
  standalone: true,
  templateUrl: './import-transaction.component.html',
  imports: [
    KeyValuePipe,
    ReactiveFormsModule,
    NgClass
  ],
  styleUrl: './import-transaction.component.scss'
})

/**
 * Component responsible of mapping the given CSV to Transaction Database
 */
export class ImportTransactionComponent implements OnInit {

  private groupBuilder = new GroupBuilder();

  private SWITCH_AMOUNT_TYPE = 'switchAmountType';

  private AMOUNT_CONTROL_NAME = 'Montant';
  private DATE_CONTROL_NAME = 'Date';
  private TYPE_CONTROL_NAME = 'Type';
  private CREDIT_CONTROL_NAME = 'Credit';
  private DEBIT_CONTROL_NAME = 'Debit';
  private LABEL_CONTROL_NAME = "Libellé de la transaction"
  private COMMENT_CONTROL_NAME = 'Commentaire';

  private targetsWithAmountType =
    this.groupBuilder.addGroup(this.DATE_CONTROL_NAME)
      .addGroup(this.AMOUNT_CONTROL_NAME)
      .addElement(this.TYPE_CONTROL_NAME)
      .addAdditionalField({key: this.SWITCH_AMOUNT_TYPE, label: 'Montant/Type'})
      .addGroup(this.COMMENT_CONTROL_NAME)
      .addGroup(this.LABEL_CONTROL_NAME)
      .build();

  private targetsWithAmountSigned =
    this.groupBuilder.init().addGroup(this.DATE_CONTROL_NAME)
      .addGroup(this.AMOUNT_CONTROL_NAME)
      .addAdditionalField({key: this.SWITCH_AMOUNT_TYPE, label: 'Montant signé'})
      .addGroup(this.COMMENT_CONTROL_NAME)
      .addGroup(this.LABEL_CONTROL_NAME)
      .build();

  private targetsWithCreditDebit =
    this.groupBuilder.init().addGroup(this.DATE_CONTROL_NAME)
      .addGroup(this.CREDIT_CONTROL_NAME)
      .addElement(this.DEBIT_CONTROL_NAME)
      .addAdditionalField({key: this.SWITCH_AMOUNT_TYPE, label: 'Crédit/Débit'})
      .addGroup(this.COMMENT_CONTROL_NAME)
      .addGroup(this.LABEL_CONTROL_NAME)
      .build();

  private AMOUNT_TYPE_CHOICES = new Map<AmountType, Group[]>([
    [AmountType.TYPED, this.targetsWithAmountType],
    [AmountType.SIGNED, this.targetsWithAmountSigned],
    [AmountType.CREDITDEBIT, this.targetsWithCreditDebit],
  ]);

  form!: FormGroup;

  csvContent = input.required<Map<string, string[]>>();

  amountTypeState = signal(0);
  dateFormatState = signal('DD/MM/YYYY');

  rowsOverview = signal(new Map<string, string[]>());

  mappingTargets: Signal<Group[]|undefined> = computed(() =>
    this.AMOUNT_TYPE_CHOICES.get(this.amountTypeState() % this.AMOUNT_TYPE_CHOICES.size));

  @Input({required: true})
  confirmation$!: Observable<boolean>;

  constructor(private fb: FormBuilder, private transactionService: TransactionServiceGateway) {
    effect(() => {
      this.initForm();
      this.changeOverviewOnTargetMappingChange();
    });
  }

  ngOnInit() {
    this.confirmation$.subscribe((confirmed) => {
      if(confirmed) {
        this.transactionService.saveTransactions$(this.formToTransactions()).subscribe();
      }
      this.clearForm();
    });
  }

  public incrementChoiceClick() {
    this.amountTypeState.update(value => value + 1);
  }

  private clearForm() {
    if(!this.form) {
      return;
    }
    this.form.reset();
    if(this.rowsOverview().size > 0) {
      for(const key of this.rowsOverview().keys()) {
        this.rowsOverview().set(key, []);
      }
    }
  }

  private formToTransactions(): Transaction[] {

    const transactions: Transaction[] = [];

    const dates = this.csvContent().get(this.form.get(this.DATE_CONTROL_NAME)?.value) as string[];
    const comments = this.csvContent().get(this.form.get(this.COMMENT_CONTROL_NAME)?.value)  as string[];
    const labels = this.csvContent().get(this.form.get(this.LABEL_CONTROL_NAME)?.value)  as string[];
    const amounts = this.csvContent().get(this.form.get(this.AMOUNT_CONTROL_NAME)?.value)  as string[];

    switch (this.amountTypeState()) {
      case AmountType.SIGNED:
        for(let i=0; i<amounts?.length; i++) {
          transactions.push({
            date: moment(dates[i], this.dateFormatState()).toDate(),
            id: uuidv4(),
            label: labels[i],
            amount: Math.abs(this.normalizeAmount(amounts[i])),
            type: Number(amounts[i]) > 0 ? TransactionType.CREDIT: TransactionType.DEBIT,
            comment: comments[i]
          });
        }

      break;
      case AmountType.TYPED:
        const types = this.csvContent().get(this.form.get(this.AMOUNT_CONTROL_NAME)?.value) as string [];
        for(let i=0; i<amounts?.length; i++) {
          transactions.push({
            date: moment(dates[i], this.dateFormatState()).toDate(),
            id: uuidv4(),
            label: labels[i],
            amount: this.normalizeAmount(amounts[i]),
            type: types[i].toLowerCase() === 'credit' ? TransactionType.CREDIT : TransactionType.DEBIT,
            comment: comments[i]
          });
        }

      break;
      case AmountType.CREDITDEBIT:
        const credits = this.csvContent().get(this.form.get(this.CREDIT_CONTROL_NAME)?.value) as string[];
        const debits = this.csvContent().get(this.form.get(this.DEBIT_CONTROL_NAME)?.value) as string[];
        for(let i=0; i<credits.length; i++) {
          transactions.push({
            date: moment(dates[i], this.dateFormatState()).toDate(),
            id: uuidv4(),
            label: labels[i],
            amount: credits[i] !== '' ? this.normalizeAmount(credits[i]) : this.normalizeAmount(debits[i]),
            type: credits[i] ? TransactionType.CREDIT : TransactionType.DEBIT,
            comment: comments[i]
          });
        }
      break;
    }

    return transactions;
  }

  /**
   * Init form dynamically regarding to the targets required for mapping
   * @private
   */
  private initForm() {
    if(!this.form) {
      this.form = this.fb.group({});
    }
    this.mappingTargets()?.forEach((group: Group) => {
      group.fields.forEach(target => {
        if(!this.form.get(target)) {
          this.form.addControl(target, this.fb.control(''));
        }
        // Init overviews
        this.rowsOverview().set(target, []);
      })
    });
  }

  /**
   * Update overview map to display rows for selected column
   * @private
   */
  private changeOverviewOnTargetMappingChange() {
    for (const [name, control] of Object.entries(this.form.controls)) {
      control.valueChanges.subscribe({
        next: selectedColumn => {
          const rows = this.csvContent().get(selectedColumn);
          if (rows) {
            this.rowsOverview().set(name, rows);
            this.rowsOverview = signal(new Map<string, string[]>(this.rowsOverview()));
          }
        }
      });
    }
  }

  private normalizeAmount(amount: string): number {
    return Number(amount
      .replace('+','')
      .replace(',', '.')
      .replace('-', ''));
  }
}
