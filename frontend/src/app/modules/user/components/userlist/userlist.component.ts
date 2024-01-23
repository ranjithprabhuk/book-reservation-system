import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, SearchUserInput } from '../../interface/user.interface';
import { Subscription } from 'rxjs';
import { UserService } from '../../user.service';
import { LocalStorageService } from 'src/app/modules/shared/services/local-storage.service';
import {
  ToastService,
  ToastType,
} from 'src/app/modules/shared/toast/toast.service';
import { Order } from 'src/app/modules/book/interface/book.interface';
import { ConfirmationModalComponent } from 'src/app/modules/shared/components/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  public userPaginationInfo: SearchUserInput = {
    searchText: '',
    order: Order.ASC,
    orderBy: 'firstName',
    page: 1,
    take: 10,
    pageCount: 1,
    itemCount: 1,
  };
  public users$: Subscription | null = null;
  public inActivateUser$: Subscription | null = null;
  public makeAdmin$: Subscription | null = null;
  public users: User[] = [];
  public userSearchInProgress: boolean = false;

  public user$: Subscription | null = null;
  public isAdmin: boolean = false;
  public selectedUser: string = '';

  constructor(
    private _userService: UserService,
    private _localStorageService: LocalStorageService,
    private _toastService: ToastService,
    private _ngModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this._localStorageService.getInfo('user');
    this.searchUsersInfo();
  }

  public searchUsersInfo() {
    this.userSearchInProgress = true;
    if (this.userPaginationInfo) {
      this.users$ = this._userService
        .searchUsers(this.userPaginationInfo)
        .subscribe((res: any) => {
          if (res && res?.data) {
            this.userSearchInProgress = false;
            this.users = res?.data;
            this.userPaginationInfo.itemCount = res?.meta?.itemCount;
          }
        });
    }
  }

  public deleteUser(userInfo: User) {
    this.selectedUser = userInfo.id;
    const modalRef = this._ngModal.open(ConfirmationModalComponent);
    modalRef.componentInstance.header = 'Delete Confirmation?';
    modalRef.componentInstance.message = `Are you sure you want to delete the user ${userInfo.firstName} ${userInfo.lastName}?`;

    modalRef.result
      .then((isConfirmed) => {
        if (isConfirmed) {
          this.inactivateUser(this.selectedUser);
          this.selectedUser = '';
        }
      })
      .catch((err) => (this.selectedUser = ''));
  }

  private inactivateUser(userId: string) {
    this.userSearchInProgress = true;
    if (this.userPaginationInfo) {
      this.inActivateUser$ = this._userService
        .inactivateUser(userId)
        .subscribe((res: any) => {
          if (res) {
            this.searchUsersInfo();
            this._toastService.showToast(
              'Successfully deleted!',
              'User information deleted successfully',
              ToastType.SUCCESS
            );
          }
        });
    }
  }

  public giveAdminAccess(userInfo: User) {
    this.selectedUser = userInfo.id;
    const modalRef = this._ngModal.open(ConfirmationModalComponent);
    modalRef.componentInstance.header = 'Admin access Confirmation?';
    modalRef.componentInstance.message = `Are you sure you want to give admin access to the user ${userInfo.firstName} ${userInfo.lastName}?`;

    modalRef.result
      .then((isConfirmed) => {
        if (isConfirmed) {
          this.makeAdmin(this.selectedUser);
          this.selectedUser = '';
        }
      })
      .catch((err) => (this.selectedUser = ''));
  }

  private makeAdmin(userId: string) {
    this.userSearchInProgress = true;
    if (this.userPaginationInfo) {
      this.makeAdmin$ = this._userService
        .giveAdminAccess(userId)
        .subscribe((res: any) => {
          if (res) {
            this.searchUsersInfo();
            this._toastService.showToast(
              'Successfully updated!',
              'Admin access granted successfully',
              ToastType.SUCCESS
            );
          }
        });
    }
  }

  private getUserInfo() {
    this.user$ = this._localStorageService.myData$.subscribe((res) => {
      if (res && res.key === 'user' && res.value) {
        this.isAdmin = res.value.role === 'ADMIN';
      }
    });
  }

  public handlePageChange(page: number) {
    this.searchUsersInfo();
  }

  ngOnDestroy(): void {
    this.users$?.unsubscribe();
    this.user$?.unsubscribe();
    this.inActivateUser$?.unsubscribe();
    this.makeAdmin$?.unsubscribe();
  }
}
