import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  inject,
} from '@angular/core';
import { Book, Order, SearchBookInput } from '../../interface/book.interface';
import { Subscription } from 'rxjs';
import { BookService } from '../../book.service';
import { LocalStorageService } from 'src/app/modules/shared/services/local-storage.service';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BookListComponent implements OnInit, OnDestroy {
  public bookPaginationInfo: SearchBookInput = {
    searchText: '',
    order: Order.ASC,
    orderBy: 'name',
    page: 1,
    take: 10,
    pageCount: 1,
    itemCount: 1,
  };
  public books$: Subscription | null = null;
  public books: Book[] = [];
  public bookSearchInProgress: boolean = false;

  public user$: Subscription | null = null;
  public isAdmin: boolean = false;

  constructor(
    private _bookService: BookService,
    private _localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this._localStorageService.getInfo('user');
    this.searchBooksInfo();
  }

  public searchBooksInfo() {
    this.bookSearchInProgress = true;
    if (this.bookPaginationInfo) {
      this.books$ = this._bookService
        .searchBooks(this.bookPaginationInfo)
        .subscribe((res: any) => {
          if (res) {
            this.bookSearchInProgress = false;
            this.books = res.data;
            this.bookPaginationInfo.itemCount = res.meta.itemCount;
          }
        });
    }
  }

  private getUserInfo() {
    this.user$ = this._localStorageService.myData$.subscribe((res) => {
      if (res && res.key === 'user' && res.value) {
        this.isAdmin = res.value.role === 'ADMIN';
      }
    });
  }

  public handlePageChange(page: number) {
    this.searchBooksInfo();
  }

  ngOnDestroy(): void {
    this.books$?.unsubscribe();
    this.user$?.unsubscribe();
  }
}
