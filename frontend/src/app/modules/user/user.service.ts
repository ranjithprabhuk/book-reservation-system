import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToastService } from '../shared/toast/toast.service';
import { SearchUserInput, User } from './interface/user.interface';

@Injectable()
export class UserService {
  private apiurl = environment.apiHostName + 'user';
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

  searchUsers(searchPayload: SearchUserInput): Observable<User> {
    const url = `${this.apiurl}/search?${this.getSearchQuery(searchPayload)}`;
    return this._http.get<User>(url, this.httpOptions).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  private getSearchQuery(paylaod: SearchUserInput) {
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

  getUser(id: string): Observable<User> {
    return this._http.get<User>(`${this.apiurl}/${id}`, this.httpOptions).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  giveAdminAccess(id: string): Observable<User> {
    return this._http
      .patch<User>(
        `${this.apiurl}/access/${id}`,
        { role: 'ADMIN' },
        this.httpOptions
      )
      .pipe(
        tap((data) => data),
        catchError(this.handleError)
      );
  }

  inactivateUser(id: string): Observable<User> {
    return this._http
      .delete<User>(`${this.apiurl}/${id}`, this.httpOptions)
      .pipe(
        tap((data) => data),
        catchError(this.handleError)
      );
  }
}
