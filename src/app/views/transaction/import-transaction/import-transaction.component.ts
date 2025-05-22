import {Component, input, OnChanges, signal, SimpleChanges} from '@angular/core';

import {KeyValuePipe} from '@angular/common';

interface Target {
  targetName: string;
  selectedValue: string;
  overviews: string[];
}

@Component({
  selector: 'app-import-transaction',
  standalone: true,
  templateUrl: './import-transaction.component.html',
  imports: [
    KeyValuePipe
  ],
  styleUrl: './import-transaction.component.scss'
})
export class ImportTransactionComponent implements OnChanges {
  targets = input.required<string[]>();
  csvContent = input.required<Map<string, string[]>>();

  workingTargets = signal([] as Target[]);
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.workingTargets.set(this.targets().map(target => ({
          targetName: target,
          selectedValue: ''
        }) as Target
      ));
  }

  public changeFromEvent(targetField: string, event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.change(targetField, selectedValue)
  }

  public change(targetField: string, newValue: string | undefined) {
    if(newValue === undefined) {
      return;
    }
    const workingTarget = this.workingTargets();
    const index = workingTarget.findIndex(target => target.targetName == targetField);
    const values = this.csvContent().get(newValue) as string[];
    workingTarget[index].selectedValue = newValue;
    workingTarget[index].overviews = values.slice(0, 3);
    this.workingTargets.set(workingTarget);
  }

  protected readonly Array = Array;
}
