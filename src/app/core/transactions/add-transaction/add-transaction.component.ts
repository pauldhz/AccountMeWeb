import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-add-transaction',
  imports: [
    RouterLink
  ],
  templateUrl: './add-transaction.component.html',
  standalone: true,
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent {

}
