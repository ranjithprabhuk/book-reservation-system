import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import Validation from '../../../../utils/validation.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private register$: Subscription | null = null;
  public registerForm: FormGroup | null = null;
  public submitted = false;
  public apiCallInProgess = false;

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.registerForm = this._formBuilder.group(
      {
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
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
      this.apiCallInProgess = true;
      this.register$ = this._authService
        .register(this.registerForm?.value)
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
    this.registerForm?.reset();
  }

  ngOnDestroy() {
    this.register$?.unsubscribe();
  }
}
