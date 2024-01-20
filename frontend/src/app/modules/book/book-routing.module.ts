import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './components/booklist/booklist.component';
import { BookDetailsComponent } from './components/bookdetails/bookdetails.component';

const routes: Routes = [
  {
    path: '',
    component: BookListComponent,
    data: {
      title: 'Explore Books',
    },
  },
  {
    path: ':id',
    component: BookDetailsComponent,
    data: {
      title: 'Book Details',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookRoutingModule {}
