import {
  Component,
  computed,
  effect,
  Input,
  input,
  OnInit,
  Signal,
  signal
} from '@angular/core';

import {KeyValuePipe, NgClass} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {Group, GroupBuilder} from '../../../utils/mapping/group-builder';

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

  groupBuilder = new GroupBuilder();

  public SWITCH_AMOUNT_TYPE = 'switchAmountType';
  private NB_AMOUNT_TYPE_CHOICES = 3;

  private targetsWithAmountType =
    this.groupBuilder.addGroup('Date')
      .addGroup('Montant')
      .addElement('Type')
      .addAdditionalField({key: this.SWITCH_AMOUNT_TYPE, label: 'Montant/Type'})
      .addGroup('Commentaire')
      .addGroup('Informations additionnelles')
      .build();

  private targetsWithAmountSigned =
    this.groupBuilder.init().addGroup('Date')
      .addGroup('Montant')
      .addAdditionalField({key: this.SWITCH_AMOUNT_TYPE, label: 'Montant signé'})
      .addGroup('Commentaire')
      .addGroup('Informations additionnelles')
      .build();

  private targetsWithCreditDebit =
    this.groupBuilder.init().addGroup('Date')
      .addGroup('Crédit')
      .addElement('Débit')
      .addAdditionalField({key: this.SWITCH_AMOUNT_TYPE, label: 'Crédit/Débit'})
      .addGroup('Commentaire')
      .addGroup('Informations additionnelles')
      .build();

  form!: FormGroup;

  csvContent = input.required<Map<string, string[]>>();

  currentAmountTypeChoice = signal(0);
  rowsOverview = signal(new Map<string, string[]>());

  mappingTargets: Signal<Group[]> = computed(() =>
    this.currentAmountTypeChoice() % this.NB_AMOUNT_TYPE_CHOICES === 0
    ? this.targetsWithAmountType : this.currentAmountTypeChoice() % this.NB_AMOUNT_TYPE_CHOICES === 1
    ? this.targetsWithAmountSigned : this.targetsWithCreditDebit);

  @Input({required: true})
  confirmation$!: Observable<boolean>;

  constructor(private fb: FormBuilder) {
    effect(() => {
      this.initForm();
      this.changeOverviewOnTargetMappingChange();
    });
  }


  ngOnInit() {
    this.confirmation$.subscribe(() => {});
  }

  public incrementChoiceClick() {
    this.currentAmountTypeChoice.update(value => value + 1);
  }

  /**
   * Init form dynamically regarding to the targets required for mapping
   * @private
   */
  private initForm() {
    if(!this.form) {
      this.form = this.fb.group({});
    }
    this.mappingTargets().forEach((group: Group) => {
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
}
