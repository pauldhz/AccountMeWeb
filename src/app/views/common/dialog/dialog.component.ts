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
  public open: boolean = false;

  @Output()
  closed = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    if (this.open) {
      this.handleClose('escape');
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === this.el.nativeElement.querySelector('.dialog-backdrop')) {
      this.handleClose('backdrop');
    }
  }

  onCloseButtonClick() {
    this.handleClose('button');
  }

  close() {
    this.handleClose('programmatic');
  }

  private handleClose(reason: 'backdrop' | 'escape' | 'button' | 'programmatic') {
    this.open = false;
    this.closed.emit();
  }

}
