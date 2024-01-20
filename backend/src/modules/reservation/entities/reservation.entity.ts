import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AppBaseEntity } from 'src/shared/entities/base.entity';
import { Book } from 'src/modules/book/entities/book.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class Reservation extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.bookReservations)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id',  })
  user: User;

  @ManyToOne(() => Book, (book) => book.bookReservations)
  @JoinColumn({ name: 'bookId', referencedColumnName: 'id' })
  book: Book;

  @Column({ type: 'date' })
  fromDate: Date;

  @Column({ type: 'date' })
  toDate: Date;
}
