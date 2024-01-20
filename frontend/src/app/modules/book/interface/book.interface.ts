import { User } from '../../user/interface/user.interface';

export interface Book {
  name: string;
  description: string;
  ISBN: string;
  isActive: boolean;
  bookReservations: Reservation[];
}

export interface Reservation {
  user: User;
  book: Book;
  fromDate: Date;
  toDate: Date;
}

export interface SearchBookInput {
  searchText?: string;
  orderBy?: string;
  order?: Order;
  page?: number;
  take?: number;
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
