import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User } from './interface/user.interface';
import { environment } from '../../../environments/environment';
import { LoginInput } from './interface/login.interface';
import { RegisterInput } from './interface/register.interface';
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
        tap((data) => data),
        catchError(this.handleError)
      );
  }

  register(registerPayload: RegisterInput): Observable<User> {
    return this._http
      .post<User>(`${this.apiurl}/signup`, registerPayload, this.httpOptions)
      .pipe(
        tap((data) => data),
        catchError(this.handleError)
      );
  }
}
