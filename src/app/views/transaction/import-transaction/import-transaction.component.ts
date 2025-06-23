import {Component, computed, effect, Input, input, OnInit, Signal, signal} from '@angular/core';

import {KeyValuePipe, NgClass} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {Group, GroupBuilder} from '../../../utils/mapping/group-builder';
import {Transaction, TransactionType} from '../../../core/transaction/model/transaction-model';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import {TransactionServiceGateway} from '../../../core/transaction/port/transaction.service.gateway';

enum AmountProposition {
  TYPED,
  SIGNED,
  CREDITDEBIT
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

  private AMOUNT_CONTROL_NAME = 'Montant';
  private DATE_CONTROL_NAME = 'Date';
  private TYPE_CONTROL_NAME = 'Type';
  private CREDIT_CONTROL_NAME = 'Credit';
  private DEBIT_CONTROL_NAME = 'Debit';
  private LABEL_CONTROL_NAME = "Libellé de la transaction"
  private COMMENT_CONTROL_NAME = 'Commentaire';

  private readonly TYPED_AMOUNT_PROPOSITION = 'Montant/Type';
  private readonly SIGNED_AMOUNT_PROPOSITION = 'Montant signé';
  private readonly CREDIT_DEBIT_PROPOSITION = 'Crédit/Débit';

  private amountPropositions = new Map([
    [AmountProposition.TYPED, this.TYPED_AMOUNT_PROPOSITION],
    [AmountProposition.SIGNED, this.SIGNED_AMOUNT_PROPOSITION],
    [AmountProposition.CREDITDEBIT, this.CREDIT_DEBIT_PROPOSITION],
  ]);

  private readonly AMOUNT_GROUP = 'Amount Group';

  private targets =
    this.groupBuilder
      .addGroupUniqueProposition(this.DATE_CONTROL_NAME)
      .addGroup(this.AMOUNT_GROUP)
        .addProposition(this.TYPED_AMOUNT_PROPOSITION).addField(this.AMOUNT_CONTROL_NAME).addField(this.TYPE_CONTROL_NAME)
        .addProposition(this.SIGNED_AMOUNT_PROPOSITION).addField(this.AMOUNT_CONTROL_NAME)
        .addProposition(this.CREDIT_DEBIT_PROPOSITION).addField(this.CREDIT_CONTROL_NAME).addField(this.DEBIT_CONTROL_NAME)
      .addGroupUniqueProposition(this.COMMENT_CONTROL_NAME)
      .addGroupUniqueProposition(this.LABEL_CONTROL_NAME)
      .build();

  form!: FormGroup;

  csvContent = input.required<Map<string, string[]>>();
  rowsOverview = signal(new Map<string, string[]>());

  private selection = signal(this.buildSelection());
  private dateFormatState = signal('DD/MM/YYYY');

  mappingTargets: Signal<Group[]|undefined> = computed(() => {
    let map = [...  this.targets];
    this.selection().forEach((selectedProposition, groupName) => {
      map.forEach(group => {
        if(group.name === groupName) {
          group.selectedProposition = group.propositions.find(proposition => proposition.label === selectedProposition);
        } else {
          group.selectedProposition = group.propositions[0];
        }
      });
    });
    return map;
  });

  amountTypeState = computed<AmountProposition | null>(() => {
    let result = null;
    this.amountPropositions.forEach((value, key) => {
      if(this.selection().get(this.AMOUNT_GROUP) === value) {
        result = key;
      }
    })
    return result;
  })

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

  public updateSelection(group: Group, selectedValue: EventTarget | null) {
    if(!group.name || selectedValue === null) {
      return;
    }
    const updatedSelection = new Map(this.selection());
    updatedSelection.set(group.name, (selectedValue as HTMLSelectElement).value);
    this.selection.set(updatedSelection);
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
      case AmountProposition.SIGNED:
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
      case AmountProposition.TYPED:
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
      case AmountProposition.CREDITDEBIT:
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
      default:
        console.log("formulaire invalide");
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
      group.propositions.forEach(proposition => proposition.fields.forEach(target => {
        if(!this.form.get(target)) {
          this.form.addControl(target, this.fb.control(''));
        }
        // Init overviews
        this.rowsOverview().set(target, []);
      }))
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

  private buildSelection() {
    const selection = new Map<string, string>();
    this.targets.forEach(group => {
      if(group.name) {
        selection.set(group.name, group.propositions[0].label);
      }
    });

    return selection;
  }

  private normalizeAmount(amount: string): number {
    return Number(amount
      .replace('+','')
      .replace(',', '.')
      .replace('-', ''));
  }
}
