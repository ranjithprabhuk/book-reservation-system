import { Order, Reservation } from '../../book/interface/book.interface';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  isActive: boolean;
  role: string;
  bookReservations?: Reservation[];
}

export interface SearchUserInput {
  searchText: string;
  orderBy: string;
  order: Order;
  page: number;
  take: number;
  pageCount: number;
  itemCount: number;
}
