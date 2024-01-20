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
import { convertToIsoString } from '../../../../utils/date.util';

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
    this.fromDate = this.getFirstAvailableDate(this.today);
    this.toDate = this.getFirstAvailableDate(
      _calendar.getNext(this.today, 'd', 15)
    );
  }

  @Input() book: any;

  public user$: Subscription | null = null;
  private reserveBook$: Subscription | null = null;

  public user: User | null = null;
  public isApiCallInProgress = false;

  ngOnInit() {
    this.getUserInfo();
  }

  today: NgbDate;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  holidays: { month: number; day: number; text: string }[] = [
    { month: 1, day: 1, text: 'New Years Day' },
    { month: 3, day: 30, text: 'Good Friday (hi, Alsace!)' },
    { month: 5, day: 1, text: 'Labour Day' },
    { month: 5, day: 5, text: 'V-E Day' },
    { month: 7, day: 14, text: 'Bastille Day' },
    { month: 8, day: 15, text: 'Assumption Day' },
    { month: 11, day: 1, text: 'All Saints Day' },
    { month: 11, day: 11, text: 'Armistice Day' },
    { month: 12, day: 25, text: 'Christmas Day' },
  ];

  isHoliday(date: NgbDate): string {
    const holiday = this.holidays.find(
      (h) => h.day === date.day && h.month === date.month
    );
    return holiday ? holiday.text : '';
  }

  markDisabled(date: any, current: any): boolean {
    return (
      this.isHoliday(date) !== '' ||
      (this.isWeekend(date) && date.month === current.month)
    );
  }

  onDateSelection(date: NgbDate) {
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

  getTooltip(date: NgbDate): string {
    const holidayTooltip = this.isHoliday(date);

    if (holidayTooltip) {
      return holidayTooltip;
    } else if (this.isRange(date) && !this.isWeekend(date)) {
      return 'Vacations!';
    } else {
      return '';
    }
  }

  getFirstAvailableDate(date: NgbDate): NgbDate {
    while (this.isWeekend(date) || this.isHoliday(date)) {
      date = this._calendar.getNext(date, 'd', 1);
    }
    return date;
  }

  isWeekend(date: NgbDate) {
    return this._calendar.getWeekday(date) >= 6;
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  public reserveBook() {
    if (this.fromDate) {
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
