import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  standalone: true,
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  @Input()
  public open: boolean;

}
