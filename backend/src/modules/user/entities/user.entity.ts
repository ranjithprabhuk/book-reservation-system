import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entities/base.entity';
import { Reservation } from 'src/modules/reservation/entities/reservation.entity';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User extends AppBaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: Role.USER })
  role: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Reservation, (bookReservation) => bookReservation.user)
  bookReservations: Reservation[];
}
