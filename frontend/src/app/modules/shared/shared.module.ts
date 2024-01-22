import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http.interceptor';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from './components/confirmation-modal.component';

@NgModule({
  imports: [CommonModule, NgbModalModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  declarations: [ConfirmationModalComponent],
  exports: [],
})
export class SharedModule {}
