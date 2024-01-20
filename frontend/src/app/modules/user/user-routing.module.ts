import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/userlist/userlist.component';
import { UserDetailsComponent } from './components/userdetails/userdetails.component';

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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
