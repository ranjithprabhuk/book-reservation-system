import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToastService } from '../shared/toast/toast.service';
import { Book, Order, SearchBookInput } from './interface/book.interface';

@Injectable()
export class BookService {
  private apiurl = environment.apiHostName + 'book';
  private httpOptions = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json'),
  };

  constructor(private _http: HttpClient, private _toastService: ToastService) {}

  private handleError = (error: any) => {
    this._toastService.handleError(error);
    return Promise.resolve(error);
  };

  searchBooks(searchPayload: SearchBookInput): Observable<Book> {
    const url = `${this.apiurl}/search?${this.getSearchQuery(searchPayload)}`;
    return this._http.get<Book>(url).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  private getSearchQuery(paylaod: SearchBookInput) {
    let query = '';

    if (paylaod.searchText) {
      query += `search=${encodeURIComponent(paylaod.searchText)}&`;
    }

    if (paylaod.searchText) {
      query += `orderBy=${paylaod.orderBy}&`;
    }

    if (paylaod.searchText) {
      query += `order=${paylaod.order}&`;
    }

    if (paylaod.searchText) {
      query += `page=${paylaod.page}&`;
    }

    if (paylaod.searchText) {
      query += `take=${paylaod.take}`;
    }

    return query;
  }
}
