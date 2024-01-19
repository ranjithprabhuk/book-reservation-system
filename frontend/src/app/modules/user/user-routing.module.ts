import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './userlist/userlist.component';
import { UserDetailsComponent } from './userdetails/userdetails.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    data: {
      title: 'Member List',
    },
  },
  {
    path: ':id',
    component: UserDetailsComponent,
    data: {
      title: 'Member Details',
    },
  },
];

@NgModule({
  declarations: [UserListComponent, UserDetailsComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
