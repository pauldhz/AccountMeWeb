import {Component, Input, input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';

import {KeyValuePipe} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {Group} from '../../../utils/group-builder';

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
  form!: FormGroup;

  mappingTargets = input.required<Group[]>();
  csvContent = input.required<Map<string, string[]>>();

  rowsOverview = signal(new Map<string, string[]>());

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

  protected readonly Array = Array;
}
