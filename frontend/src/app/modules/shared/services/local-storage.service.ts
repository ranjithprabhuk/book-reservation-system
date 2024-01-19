import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private _localStorage: Storage | null = null;

  private _myData$ = new BehaviorSubject<any>(null);
  public myData$ = this._myData$.asObservable();

  constructor() {
    this._localStorage = window.localStorage;
  }

  setInfo(key: string, value: Record<string, any>): void {
    const jsonData = JSON.stringify(value);
    this._localStorage?.setItem(key, jsonData);
    this._myData$.next({ key, value });
  }

  getInfo(key: string): void {
    const value = JSON.parse(this._localStorage?.getItem(key) || '{}');
    this._myData$.next({ key, value });
  }

  clearInfo(key: string) {
    this._localStorage?.removeItem(key);
    this._myData$.next({ key, value: null });
  }

  clearAllLocalStorage(): void {
    this._localStorage?.clear();
    this._myData$.next(null);
  }
}
