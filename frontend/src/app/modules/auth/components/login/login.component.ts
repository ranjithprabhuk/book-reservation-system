import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private login$: Subscription | null = null;
  public registerForm: FormGroup | null = null;
  submitted = false;

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm?.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm?.invalid) {
      return;
    }

    if (this.registerForm) {
      this.login$ = this._authService
        .login(this.registerForm?.value)
        .subscribe((response) => {
          console.log('asdasda', response);
          if (response && response.username) {
            // navigate to books
            this._router.navigateByUrl('/app/book');
          } else {
            // reset the form
            this.submitted = false;
          }
        });
    }
  }

  onReset() {
    this.submitted = false;
    this.registerForm?.reset();
  }

  ngOnDestroy() {
    this.login$?.unsubscribe();
  }
}
