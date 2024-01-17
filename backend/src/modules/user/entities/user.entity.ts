import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entities/base.entity';

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
}
