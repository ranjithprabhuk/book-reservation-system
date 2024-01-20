import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BookService } from './book.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BookListComponent } from './components/booklist/booklist.component';
import { BookDetailsComponent } from './components/bookdetails/bookdetails.component';

@NgModule({
  imports: [
    CommonModule,
    BookRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [BookListComponent, BookDetailsComponent],
  providers: [BookService],
})
export class BookModule {}
