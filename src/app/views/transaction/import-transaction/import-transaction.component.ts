import {Component, input} from '@angular/core';

@Component({
  selector: 'app-import-transaction',
  standalone: true,
  templateUrl: './import-transaction.component.html',
  styleUrl: './import-transaction.component.scss'
})
export class ImportTransactionComponent {
  targets= input.required<string[]>();
  header = input.required<string[]>();
}
