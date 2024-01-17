import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entities/base.entity';
import { Reservation } from 'src/modules/reservation/entities/reservation.entity';

@Entity()
export class Book extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  ISBN: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Reservation, (bookReservation) => bookReservation.book)
  bookReservations: Reservation[];
}
