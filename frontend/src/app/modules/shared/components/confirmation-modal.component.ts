import { Component, inject, Input, Type } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  modal = inject(NgbActiveModal);
  constructor() {}

  @Input() message: string = '';
  @Input() header: string = '';
}
