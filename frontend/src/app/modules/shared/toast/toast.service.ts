import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface IToast {
  title: string;
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toast: BehaviorSubject<IToast | any> = new BehaviorSubject(null);
  public toast$: Observable<IToast | null> = this.toast.asObservable();

  public showToast(
    title: string,
    message: string,
    type: ToastType = ToastType.ERROR
  ) {
    this.toast.next({ title, message, type });
  }

  public hideToast() {
    this.toast.next(null);
  }

  public handleError(e: any) {
    switch (e?.status) {
      case 400:
        this.showToast(
          e?.error?.error || 'Error',
          e?.error?.message || e?.statusText || 'Something went wrong!'
        );
        break;
      default:
        this.showToast(
          e?.error?.error || 'Error',
          e?.error?.message || e?.statusText || 'Something went wrong!'
        );
        break;
    }
  }
}
