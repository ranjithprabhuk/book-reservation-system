import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entities/base.entity';

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

  @Column({ select: false })
  password: string;
}
