import {Component, computed, Input, input, OnChanges, OnInit, Signal, signal, SimpleChanges} from '@angular/core';

import {KeyValuePipe} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {Group, GroupBuilder} from '../../../utils/mapping/group-builder';

@Component({
  selector: 'app-import-transaction',
  standalone: true,
  templateUrl: './import-transaction.component.html',
  imports: [
    KeyValuePipe,
    ReactiveFormsModule
  ],
  styleUrl: './import-transaction.component.scss'
})

/**
 * Component responsible of mapping the given CSV to Transaction Database
 */
export class ImportTransactionComponent implements OnChanges, OnInit {

  groupBuilder = new GroupBuilder();

  public SWITCH_AMOUNT_TYPE = 'switchAmountType';
  private NB_AMOUNT_TYPE_CHOICES = 2;

  private targetsWithAmountType =
    this.groupBuilder.addGroup('Date')
      .addGroup('Montant')
      .addElement('Type')
      .addAdditionalField({key: this.SWITCH_AMOUNT_TYPE, label: 'Montant typé'})
      .addGroup('Commentaire')
      .addGroup('Informations additionnelles')
      .build();

  private targetsWithAmountSigned =
    this.groupBuilder.init().addGroup('Date')
      .addGroup('Montant')
      .addAdditionalField({key: this.SWITCH_AMOUNT_TYPE, label: 'Montant & Type'})
      .addGroup('Commentaire')
      .addGroup('Informations additionnelles')
      .build();

  form!: FormGroup;

  csvContent = input.required<Map<string, string[]>>();

  currentAmountTypeChoice = signal(0);
  rowsOverview = signal(new Map<string, string[]>());

  mappingTargets: Signal<Group[]> = computed(() =>
    this.currentAmountTypeChoice() % this.NB_AMOUNT_TYPE_CHOICES === 0
    ? this.targetsWithAmountType
    : this.targetsWithAmountSigned);

  @Input({required: true})
  confirmation$!: Observable<boolean>;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.confirmation$.subscribe(() => {});
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes['csvContent']) {
      this.initForm();
      this.changeOverviewOnTargetMappingChange();
    }
  }

  public incrementChoiceClick() {
    this.currentAmountTypeChoice.update(value => value + 1);
  }

  /**
   * Init form dynamically regarding to the targets required for mapping
   * @private
   */
  private initForm() {
    this.form = this.fb.group({});
    this.mappingTargets().forEach((group: Group) => {
      group.fields.forEach(target => {
        this.form.addControl(target, this.fb.control(''));
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
