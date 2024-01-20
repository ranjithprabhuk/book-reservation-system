import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private login$: Subscription | null = null;
  public loginForm: FormGroup | null = null;

  public submitted = false;
  public apiCallInProgess = false;

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm?.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm?.invalid) {
      return;
    }

    if (this.loginForm) {
      this.apiCallInProgess = true;
      this.login$ = this._authService
        .login(this.loginForm?.value)
        .subscribe((response) => {
          if (response && response.username) {
            // persist the user details for further usage
            this._localStorageService.setInfo('user', response);
            // navigate to books
            this._router.navigateByUrl('/app/book');
          } else {
            // reset the form
            this.submitted = false;
            this.apiCallInProgess = false;
          }
        });
    }
  }

  onReset() {
    this.submitted = false;
    this.loginForm?.reset();
  }

  ngOnDestroy() {
    this.login$?.unsubscribe();
  }
}
