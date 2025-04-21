import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
// Todo: To place in lib when Design System be developed
@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  standalone: true,
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  @Input()
  open: boolean = false;
  @Input()
  title!: string;

  @Output()
  closed = new EventEmitter<boolean>();

  constructor(private el: ElementRef) {}

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    if (this.open) {
      this.handleCancel();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === this.el.nativeElement.querySelector('.dialog-backdrop')) {
      this.handleCancel();
    }
  }

  onCloseButtonClick() {
    this.handleCancel();
  }

  onConfirm() {
    this.closed.emit(true);
  }

  private handleCancel() {
    this.open = false;
    this.closed.emit(false);
  }

}
