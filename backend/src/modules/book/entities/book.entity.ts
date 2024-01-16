import { Entity, Column } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entities/base.entity';

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
}
