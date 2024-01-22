import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { LocalStorageService } from 'src/app/modules/shared/services/local-storage.service';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss'],
})
export class BaseLayoutComponent implements OnInit, OnDestroy {
  private user$: Subscription | null = null;
  public user: any = null;

  constructor(
    private _localStorageService: LocalStorageService,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  private getUserInfo() {
    this._localStorageService.getInfo('user');
    this.user$ = this._localStorageService.myData$.subscribe((res) => {
      if (res && res.key === 'user' && res.value) {
        this.user = res.value;
      }
    });
  }

  public logout() {
    this._authService.logout()
    this._localStorageService.clearAllLocalStorage();
    this._router.navigateByUrl('auth/login');
  }

  ngOnDestroy() {
    this.user$?.unsubscribe();
  }
}
