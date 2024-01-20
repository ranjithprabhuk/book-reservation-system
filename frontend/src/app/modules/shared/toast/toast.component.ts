import { Component, ViewEncapsulation } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <ng-container *ngIf="toastService.toast$ | async as toast">
      <div
        [class]="toast.type + ' p-2'"
        style="position: absolute; top: 0; right: 0;"
      >
        <ngb-toast
          class="toast"
          [animation]="true"
          [delay]="500000"
          [header]="toast.title"
          [autohide]="true"
          (hidden)="toastService.hideToast()"
        >
          <span>{{ toast.message }}</span>
        </ngb-toast>
      </div>
    </ng-container>
  `,
  styleUrls: ['./toast.style.scss'],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
