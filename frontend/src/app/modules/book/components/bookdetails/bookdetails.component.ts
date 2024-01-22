import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { BookService } from '../../book.service';
import { Book } from '../../interface/book.interface';
import {
  ToastService,
  ToastType,
} from 'src/app/modules/shared/toast/toast.service';
import { User } from 'src/app/modules/user/interface/user.interface';

@Component({
  selector: 'app-bookdetails',
  templateUrl: './bookdetails.component.html',
  styleUrls: ['./bookdetails.component.scss'],
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);

  private addBook$: Subscription | null = null;
  private updateBook$: Subscription | null = null;
  private book$: Subscription | null = null;
  public user$: Subscription | null = null;

  public isAdmin: boolean = false;
  public user: User | null = null;
  public bookForm: FormGroup | null = null;
  public submitted = false;
  public isApiCallInProgress = false;
  public isNew = true;
  public bookId: string = '';
  public book: Book | null = null;
  public active: number = 1;

  constructor(
    private _bookService: BookService,
    private _formBuilder: FormBuilder,
    private _toastService: ToastService,
    private _router: Router,
    private _localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.onLoad();
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  private onLoad() {
    this.createBookForm();
    this.getUserInfo();
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.isNew = false;
      this.bookId = id || '';
      this.getBook();
    }
  }

  private createBookForm() {
    this.bookForm = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ISBN: ['', Validators.required],
      author: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.bookForm?.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.bookForm?.invalid) {
      return;
    }

    if (this.bookForm) {
      this.isApiCallInProgress = true;
      this.bookForm?.disable();
      if (this.isNew) {
        this.addBook();
      } else {
        this.updateBook();
      }
    }
  }

  private updateBook() {
    this.updateBook$ = this._bookService
      .updateBook(this.bookId, this.bookForm?.value)
      .subscribe((response) => {
        if (response) {
          // toast notification for successful update
          this._toastService.showToast(
            'Successfully updated!',
            'Book information updated successfully',
            ToastType.SUCCESS
          );
          this.submitted = false;
          this.isApiCallInProgress = false;
          this.bookForm?.enable();
        } else {
          // reset the form
          this.submitted = false;
          this.isApiCallInProgress = false;
          this.bookForm?.enable();
        }
      });
  }

  private addBook() {
    this.updateBook$ = this._bookService
      .addBook(this.bookForm?.value)
      .subscribe((response: any) => {
        if (response && response.id) {
          this._toastService.showToast(
            'Successfully added!',
            response.name + ' added successfully',
            ToastType.SUCCESS
          );
          this._router.navigateByUrl('/app/book/' + response.id);
        } else {
          // reset the form
          this.submitted = false;
          this.isApiCallInProgress = false;
          this.bookForm?.enable();
        }
      });
  }

  public getBookReservations() {
    if (!this.isAdmin) {
      return this.book?.bookReservations.filter(reservation => reservation.user.id === this.user?.id)
    }

    return this.book?.bookReservations;
  }

  private getBook() {
    this.isApiCallInProgress = true;
    this.book$ = this._bookService
      .getBook(this.bookId)
      .subscribe((response) => {
        if (response) {
          this.setBookFormValues(response);
        }
      });
  }

  private getUserInfo() {
    this._localStorageService.getInfo('user');
    this.user$ = this._localStorageService.myData$.subscribe((res) => {
      if (res && res.key === 'user' && res.value) {
        this.isAdmin = res.value.role === 'ADMIN';
        this.user = res.value;
        if (!this.isAdmin) {
          this.bookForm?.disable();
        }
      }
    });
  }

  private setBookFormValues(bookInfo: Book) {
    this.book = bookInfo;
    const { name, description, ISBN, author } = bookInfo;
    this.bookForm?.setValue({ name, description, ISBN, author });
    if (!this.isAdmin) {
      this.bookForm?.disable();
    }
    this.isApiCallInProgress = false;
  }

  onReset() {
    this.submitted = false;
    this.bookForm?.reset();
  }

  ngOnDestroy() {
    this.book$?.unsubscribe();
    this.addBook$?.unsubscribe();
    this.updateBook$?.unsubscribe();
    this.user$?.unsubscribe();
  }
}
