import {Component, computed, effect, Input, input, OnInit, Signal, signal} from '@angular/core';

import {KeyValuePipe, NgClass} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
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

  private readonly AMOUNT_CONTROL_NAME = 'Montant';
  private readonly DATE_CONTROL_NAME = 'Date';
  private readonly TYPE_CONTROL_NAME = 'Type';
  private readonly CREDIT_CONTROL_NAME = 'Credit';
  private readonly DEBIT_CONTROL_NAME = 'Debit';
  private readonly LABEL_CONTROL_NAME = "Libellé de la transaction"
  private readonly COMMENT_CONTROL_NAME = 'Commentaire';

  private readonly AMOUNT_GROUP = 'Amount Group';

  private readonly TYPED_AMOUNT_PROPOSITION = 'Montant/Type';
  private readonly SIGNED_AMOUNT_PROPOSITION = 'Montant signé';
  private readonly CREDIT_DEBIT_PROPOSITION = 'Crédit/Débit';

  private readonly ISO_FORMAT = 'YYYY-MM-DD'; // ex: 2025-06-16
  private readonly FRENCH_FORMAT = 'DD/MM/YYYY'; // ex: 16/06/2025
  private readonly US_FORMAT = 'MM/DD/YYYY'; // ex: 06/16/2025
  private readonly COMPACT_FORMAT = 'YYYYMMDD'; // ex: 20250616
  private readonly DATETIME_ISO = 'YYYY-MM-DDTHH:mm:ss'; // ex: 2025-06-16T14:30:00
  private readonly DATETIME_FULL_FR = 'DD/MM/YYYY HH:mm:ss'; // ex: 16/06/2025 14:30:00
  private readonly DATETIME_FULL_US = 'MM/DD/YYYY hh:mm A'; // ex: 06/16/2025 02:30 PM
  private readonly RFC_2822_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss ZZ'; // ex: Mon, 16 Jun 2025 14:30:00 +0200
  private readonly SHORT_DATE = 'DD/MM/YY'; // ex: 16/06/25
  private readonly VERBOSE_FR = 'dddd D MMMM YYYY'; // ex: lundi 16 juin 2025
  private readonly VERBOSE_EN = 'dddd, MMMM D, YYYY'; // ex: Monday, June 16, 2025


  private amountPropositions = new Map([
    [AmountProposition.TYPED, this.TYPED_AMOUNT_PROPOSITION],
    [AmountProposition.SIGNED, this.SIGNED_AMOUNT_PROPOSITION],
    [AmountProposition.CREDITDEBIT, this.CREDIT_DEBIT_PROPOSITION],
  ]);

  private targets =
    this.groupBuilder
      .addGroup(this.DATE_CONTROL_NAME)
      .addPropositionUniqueField(this.ISO_FORMAT)
      .addPropositionUniqueField(this.FRENCH_FORMAT)
      .addPropositionUniqueField(this.US_FORMAT)
      .addPropositionUniqueField(this.COMPACT_FORMAT)
      .addPropositionUniqueField(this.DATETIME_ISO)
      .addPropositionUniqueField(this.DATETIME_FULL_FR)
      .addPropositionUniqueField(this.DATETIME_FULL_US)
      .addPropositionUniqueField(this.RFC_2822_FORMAT)
      .addPropositionUniqueField(this.SHORT_DATE)
      .addPropositionUniqueField(this.VERBOSE_FR)
      .addPropositionUniqueField(this.VERBOSE_EN)
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
  });

  dateFormatState = computed<string | null>(() => this.selection().get(this.DATE_CONTROL_NAME) || null);

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
            date: moment(dates[i], (this.dateFormatState() as string)).toDate(),
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
            date: moment(dates[i], (this.dateFormatState() as string)).toDate(),
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
            date: moment(dates[i], (this.dateFormatState() as string)).toDate(),
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
        const input = this.form.get(target) as FormControl;
        if(!input) {
          this.form.addControl(target, this.fb.control(''));
        }
        else {
          if(!input.value) {
            // Init overviews
            this.rowsOverview().set(target, []);
          }
        }
      }));
    });
  }

  /**
   * Update overview map to display rows for selected column
   * @private
   */
  private changeOverviewOnTargetMappingChange() {
    for (const [name, control] of Object.entries(this.form.controls)) {
      // Don't subscribe one more time for controls already changed
      if(control.value) {
        continue;
      }
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
