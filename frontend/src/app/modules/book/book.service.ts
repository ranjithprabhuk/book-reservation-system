import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToastService } from '../shared/toast/toast.service';
import {
  Book,
  CreateBookInput,
  SearchBookInput,
} from './interface/book.interface';

@Injectable()
export class BookService {
  private apiurl = environment.apiHostName + 'book';
  private httpOptions = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json'),
    withCredentials: true,
  };

  constructor(private _http: HttpClient, private _toastService: ToastService) {}

  private handleError = (error: any) => {
    this._toastService.handleError(error);
    return Promise.resolve(error);
  };

  searchBooks(searchPayload: SearchBookInput): Observable<Book[]> {
    const url = `${this.apiurl}/search?${this.getSearchQuery(searchPayload)}`;
    return this._http.get<Book[]>(url, this.httpOptions).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  private getSearchQuery(paylaod: SearchBookInput) {
    let query = '';

    if (paylaod.searchText) {
      query += `searchText=${encodeURIComponent(paylaod.searchText)}&`;
    }

    if (paylaod.orderBy) {
      query += `orderBy=${paylaod.orderBy}&`;
    }

    if (paylaod.order) {
      query += `order=${paylaod.order}&`;
    }

    if (paylaod.page) {
      query += `page=${paylaod.page}&`;
    }

    if (paylaod.take) {
      query += `take=${paylaod.take}`;
    }

    return query;
  }

  addBook(bookPayload: CreateBookInput): Observable<Book> {
    return this._http
      .post<Book>(`${this.apiurl}`, bookPayload, this.httpOptions)
      .pipe(
        tap((data) => data),
        catchError(this.handleError)
      );
  }

  updateBook(id: string, bookPayload: CreateBookInput): Observable<Book> {
    return this._http
      .patch<Book>(`${this.apiurl}/${id}`, bookPayload, this.httpOptions)
      .pipe(
        tap((data) => data),
        catchError(this.handleError)
      );
  }

  getBook(id: string): Observable<Book> {
    return this._http.get<Book>(`${this.apiurl}/${id}`, this.httpOptions).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  inactivateBook(id: string): Observable<Book> {
    return this._http
      .delete<Book>(`${this.apiurl}/${id}`, this.httpOptions)
      .pipe(
        tap((data) => data),
        catchError(this.handleError)
      );
  }
}
