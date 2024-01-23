import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { User } from 'src/app/modules/user/interface/user.interface';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private member$: Subscription | null = null;
  private route = inject(ActivatedRoute);
  public user$: Subscription | null = null;

  public isAdmin: boolean = false;
  public user: User | null = null;
  public memberForm: FormGroup | null = null;
  public submitted = false;
  public isApiCallInProgress = false;
  public isNew = true;
  public memberId: string = '';
  public member: User | null = null;
  public active: number = 1;

  constructor(
    private _memberService: UserService,
    private _localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.getMemberInfo();
    this.getUserInfo();
  }

  private getMemberInfo() {
    this.memberId = this.route.snapshot.paramMap.get('id') || '';
    this.isApiCallInProgress = true;
    this.member$ = this._memberService
      .getUser(this.memberId)
      .subscribe((response) => {
        if (response) {
          this.member = response;
          this.isApiCallInProgress = false;
        }
      });
  }

  private getUserInfo() {
    this._localStorageService.getInfo('user');
    this.user$ = this._localStorageService.myData$.subscribe((res) => {
      if (res && res.key === 'user' && res.value) {
        this.isAdmin = res.value.role === 'ADMIN';
        this.user = res.value;
        if (!this.isAdmin) {
          this.memberForm?.disable();
        }
      }
    });
  }

  onReset() {
    this.submitted = false;
    this.memberForm?.reset();
  }

  ngOnDestroy() {
    this.member$?.unsubscribe();
    this.user$?.unsubscribe();
  }
}
