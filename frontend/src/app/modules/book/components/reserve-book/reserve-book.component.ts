import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { User } from '../../../user/interface/user.interface';
import {
  NgbCalendar,
  NgbDate,
  NgbDateNativeAdapter,
} from '@ng-bootstrap/ng-bootstrap';
import { ReservationService } from '../../reservation.service';
import {
  ToastService,
  ToastType,
} from 'src/app/modules/shared/toast/toast.service';
import { Router } from '@angular/router';
import { convertToIsoString, formatToTwoDigits } from '../../../../utils/date.util';

@Component({
  selector: 'app-reserve-book',
  templateUrl: './reserve-book.component.html',
  styleUrls: ['./reserve-book.component.scss'],
})
export class ReserveBookComponent implements OnInit, OnDestroy {
  constructor(
    private _calendar: NgbCalendar,
    public adapter: NgbDateNativeAdapter,
    private _localStorageService: LocalStorageService,
    private _reservationService: ReservationService,
    private _toastService: ToastService,
    private _router: Router
  ) {
    this.markDisabled = this.markDisabled.bind(this);
    this.today = _calendar.getToday();
  }

  @Input() book: any;

  public user$: Subscription | null = null;
  private reserveBook$: Subscription | null = null;
  public user: User | null = null;
  public isApiCallInProgress = false;
  public today: NgbDate;
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null = null;
  public toDate: NgbDate | null = null;

  ngOnInit() {
    this.getUserInfo();
  }

  public isReserved(date: NgbDate): boolean {
    const inputDate = new Date(`${date.year}-${formatToTwoDigits(date.month)}-${formatToTwoDigits(date.day)}`);

    if (this.book?.bookReservations && this.book?.bookReservations.length) {
      for (const range of this.book?.bookReservations) {
        const fromDate = new Date(range.fromDate);
        const toDate = new Date(range.toDate);

        if (inputDate >= fromDate && inputDate <= toDate) {
          return true;
        }
      }
    }

    return false;
  }

  public markDisabled(date: any): boolean {
    return this.isReserved(date);
  }

  public onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      (date.after(this.fromDate) || date.equals(this.fromDate))
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  public getTooltip(date: NgbDate): string {
    return this.isReserved(date) ? 'Reserved!' : '';
  }

  public isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  public isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  public isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  public reserveBook() {
    if (this.fromDate) {
      this.isApiCallInProgress = true;
      const payload = {
        bookId: this.book.id,
        userId: this.user?.id,
        fromDate: convertToIsoString(this.fromDate),
        toDate: convertToIsoString(this.toDate || this.fromDate),
      };
      this.reserveBook$ = this._reservationService
        .reserveBook(payload as any)
        .subscribe((response: any) => {
          if (response && response.id) {
            this._toastService.showToast(
              'Successfully reserved!',
              this.book.name + ' reserved successfully',
              ToastType.SUCCESS
            );
            this._router.navigateByUrl('/app/book');
          } else {
            this.fromDate = null;
            this.toDate = null;
            this.isApiCallInProgress = false;
          }
        });
    }
  }

  private getUserInfo() {
    this._localStorageService.getInfo('user');
    this.user$ = this._localStorageService.myData$.subscribe((res) => {
      if (res && res.key === 'user' && res.value) {
        this.user = res.value;
      }
    });
  }

  ngOnDestroy() {
    this.user$?.unsubscribe();
    this.reserveBook$?.unsubscribe();
  }
}
