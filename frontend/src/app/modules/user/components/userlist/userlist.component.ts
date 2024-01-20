import { Component } from '@angular/core';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
})
export class UserListComponent {
  page = 1;
  pageSize = 4;
  collectionSize = 50;
  // countries: Country[];

  constructor() {
    this.refreshCountries();
  }

  refreshCountries() {
    // this.countries = COUNTRIES.map((country, i) => ({ id: i + 1, ...country })).slice(
    // 	(this.page - 1) * this.pageSize,
    // 	(this.page - 1) * this.pageSize + this.pageSize,
    // );
  }
}
