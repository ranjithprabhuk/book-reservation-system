import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User } from './interface/user.interface';
import { environment } from '../../../environments/environment';
import { LoginInput } from './interface/login.interface';
import { ToastService } from '../shared/toast/toast.service';

@Injectable()
export class AuthService {
  private apiurl = environment.apiHostName + 'auth';
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

  login(loginPayload: LoginInput): Observable<User> {
    return this._http
      .post<User>(`${this.apiurl}/login`, loginPayload, this.httpOptions)
      .pipe(
        tap((data) => {
          console.log(data);
          return data;
        }),
        catchError(this.handleError)
      );
  }

  getUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.apiurl).pipe(
      tap((data) => console.log(data)),
      catchError(this.handleError)
    );
  }
  getUser(id: number): Observable<User> {
    const url = `${this.apiurl}/${id}`;
    return this._http.get<User>(url).pipe(catchError(this.handleError));
  }

  // addUser(user: User): Observable<User> {
  //   user.id = null;
  //   return this.http.post<User>(this.apiurl, user, this.httpOptions).pipe(
  //     tap((data) => console.log(data)),
  //     catchError(this.handleError)
  //   );
  // }

  deleteUser(id: number): Observable<User> {
    const url = `${this.apiurl}/${id}`;
    return this._http
      .delete<User>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // updateUser(user: User): Observable<User> {
  //   const url = `${this.apiurl}/${user.id}`;
  //   return this.http.put<User>(this.apiurl, user, this.httpOptions).pipe(
  //     map(() => user),
  //     catchError(this.handleError)
  //   );
  // }
}
