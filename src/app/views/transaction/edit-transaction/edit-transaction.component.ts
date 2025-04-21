import {Component, Input} from '@angular/core';
import {Transaction} from '../../../core/transaction/model/transaction-model';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  standalone: true,
  styleUrl: './edit-transaction.component.scss'
})
export class EditTransactionComponent {

  @Input()
  transaction: Transaction|null = null;

}
